using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using OMInsurance.BusinessLogic;
using OMInsurance.BusinessLogic.Core;
using OMInsurance.DataAccess.DAO;
using OMInsurance.Entities;
using OMInsurance.Entities.Core;
using OMInsurance.Entities.Sorting;
using OMInsurance.Interfaces;
using OMInsurance.WebApps.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using OMInsurance.WebApps.Security;
using System.Globalization;

namespace OMInsurance.WebApps.Controllers
{
    public class ApiController : OMInsuranceController
    {

        public ApiController()
        {
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                Formatting = Formatting.None,
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                DateFormatString = "dd.MM.yyyy HH:mm:ss.FFFFFFFK"
            };
        }
        
        public ContentResult ClmSearch(ClaimInfoSearchViewModel model)
        {
            try
            {
                var _clmBL = new ClaimBusinessLogic();

                var items = _clmBL.Search(
                            model.GetSearchCriteria(),
                            new List<SortCriteria<ClaimSortField>>(),
                            new PageRequest() { PageNumber = model.PageNumber, PageSize = model.PageSize }
                        );

                return Content(JsonConvert.SerializeObject(new { items, totalCount = items.TotalCount, pageCount = items.PageCount, pageNumber = items.PageNumber }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public ContentResult AgrSearch(ClientVisitSearchCriteriaModel model)
        {
            try
            {
                var _clientBL = new ClientBusinessLogic();

                var m = new ClientVisitSearchCriteriaModel(model.GetClientSearchCriteria(), CurrentUser);

                var searchCriteria = m.GetClientSearchCriteria();

                var items = _clientBL.ClientVisit_Find(
                            m.GetClientSearchCriteria(),
                            new List<SortCriteria<ClientVisitSortField>>(),
                            new PageRequest() { PageNumber = model.PageNumber, PageSize = model.PageSize });

                return Content(JsonConvert.SerializeObject(new { items, totalCount = items.TotalCount, pageCount = items.PageCount, pageNumber = items.PageNumber }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }

        public ContentResult UsRegSearch(ClientVisitSearchCriteriaModel model)
        {
            try
            {
                var _clientBL = new ClientBusinessLogic();
                var m = new ClientVisitSearchCriteriaModel(model.GetClientSearchCriteria(), CurrentUser);
                var searchCriteria = m.GetClientSearchCriteria();

                var usRegClients = new List<ClientUsRegInfo>();
                if (searchCriteria.RegionId == 50 && !searchCriteria.DontSearchInUsReg)
                {
                    usRegClients = _clientBL.FindClientInUsReg(searchCriteria);
                }
                return Content(JsonConvert.SerializeObject(new { usRegClients }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public ContentResult ClnSearch(ClientInfoSearchCriteriaModel model)
        {
            try
            {
                var _clientBL = new ClientBusinessLogic();

                var items = _clientBL.SearchClients(
                    model.GetSearchCriteria(),
                    new List<SortCriteria<ClientSortField>>(),
                    new PageRequest() { PageNumber = model.PageNumber, PageSize = model.PageSize });

                return Content(JsonConvert.SerializeObject(new { items, totalCount = items.TotalCount, pageCount = items.PageCount, pageNumber = items.PageNumber }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
		
        public ContentResult GetClientShortInfo(long clientId)
        {
            try
            {
                var _clientBL = new ClientBusinessLogic();
                var contactInfo = _clientBL.GetClientContactInfo(clientId);
                var birthday = _clientBL.GetClientBirthday(clientId);
                var fullAddress = AddressDao.Instance.GetClientAddress(clientId);
                if (string.IsNullOrWhiteSpace(fullAddress))
                {
                    fullAddress = AddressDao.Instance.GetClientAddress(clientId, "REG");
                }
                var info = new
                {
                    email = contactInfo.Email,
                    phone = contactInfo.Phone,
                    birthday = birthday.HasValue ? birthday.Value.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture) : null,
                    fullAddress
                };

                return Content(JsonConvert.SerializeObject(info), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public ContentResult UsrSearch(UserInfoSearchCriteriaModel model)
        {
            try
            {
                var _userBL = new UserBusinessLogic();

                var items = _userBL.SearchUsers(
                    model.GetSearchCriteria(),
                    new List<SortCriteria<UserSortField>>(),
                    new PageRequest() { PageNumber = model.PageNumber, PageSize = model.PageSize });

                return Content(JsonConvert.SerializeObject(new { items, totalCount = items.TotalCount, pageCount = items.PageCount, pageNumber = items.PageNumber }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public ContentResult AgrGet(long agreeId)
        {
            try
            {
                var _clientBL = new ClientBusinessLogic();

                var agree = _clientBL.ClientVisit_Get(agreeId);
                return Content(JsonConvert.SerializeObject(new { agree }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public ContentResult AgreeLightGet(long agreeId)
        {
            try
            {
                var _clientBL = new ClientBusinessLogic();

                var agree = _clientBL.ClientVisitLight_Get(agreeId);
                return Content(JsonConvert.SerializeObject(new { agree }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public ContentResult AgreeBaseGet(long agreeId)
        {
            try
            {
                var _agrBL = new AgreeBusinessLogic();

                var agree = _agrBL.GetAgreeBase(agreeId);

                return Content(JsonConvert.SerializeObject(new { agree }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public JsonResult ClmGetClientInfo(long agreeId)
        {
            try
            {
                var _clmBL = new ClaimBusinessLogic();

                var ci = _clmBL.GetClientInfo(agreeId);

                var items = JsonConvert.SerializeObject(ci, Formatting.Indented, new JsonSerializerSettings { DateFormatString = "dd.MM.yyyy" });

                return Json(new { message = "", result = "OK", items }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { message = e.Message, result = "Error" }, JsonRequestBehavior.AllowGet);
            }
        }
       
        public ContentResult GetUserInfo(string login)
        {
            try
            {
                var loginString = string.IsNullOrWhiteSpace(login) ? AuthenticationManager.GetPrincipalNameFromCookie(HttpContext) : login;
                var userDb = UserBusinessLogic.GetUserByLogin(loginString);
                var userModel = new UserDataModel(userDb);

                return Content(JsonConvert.SerializeObject(userModel), "application/json");
                //return Json(JsonConvert.SerializeObject(userModel, new JsonSerializerSettings { DateFormatString = "dd.MM.yyyy" }), "application/json" ,JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Content(e.Message);
                //return Json(e.Message, JsonRequestBehavior.AllowGet);
            }
        }
                       
        public ContentResult GetCallsList(int pageNumber = 0, string phoneInner = null, int pageSize = 10)
        {
            try
            {
                var callsBL = new CallsBusinessLogic();
                var isChangeInternalPhone = UserDao.Instance.IsUserModuleGrant("CLAIM", "CHANGE_INTERNAL_PHONE", CurrentUser.ClientId);
                if (string.IsNullOrEmpty(phoneInner) || !isChangeInternalPhone)
                {
                    phoneInner = AgreeDao.Instance.ClientVisitContactInnerPhone(CurrentUser.ClientId);
                }
                var result = callsBL.GetCallList(phoneInner, new PageRequest() { PageNumber = pageNumber, PageSize = pageSize });
                var calls = result.Data;
                var totalCount = result.TotalCount;

                return Content(JsonConvert.SerializeObject(new { calls, totalCount, pageNumber, pageSize }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public ContentResult GetCallAgrees(int callId)
        {
            try
            {
                var callsBL = new CallsBusinessLogic();
                var agrees = callsBL.GetCallAgrees(callId);
                return Content(JsonConvert.SerializeObject(new { agrees }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
       
        
        public ContentResult BaseRefs()
        {
            try
            {
                var refBL = new ReferenceBusinessLogic();

                var regions = ReferencesProvider.GetClaimSubjectsList();
                var companies = ReferencesProvider.GetCompanyList();
                var activeCompanies = ReferencesProvider.GetActiveCompanyList();

                return Content(JsonConvert.SerializeObject(new { regions, companies, activeCompanies }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
        
        public ContentResult GetSurveys()
        {
            try
            {
                var regionId = CurrentUser.Region.Id;
                var surveyBusinessLogic = new SurveyBusinessLogic();
                var allSurveys = surveyBusinessLogic.GetAll();
                var surveys = allSurveys
                        .Where(i => i.Active && (i.RegionId == regionId || i.RegionId == 0))
                        .OrderBy(i => i.Position)
                        .Select(it => new { it.Id, it.Name })
                        .ToList();
                return Content(JsonConvert.SerializeObject(new { surveys }), "application/json");
            }
            catch (Exception ex)
            {
                return Content(ex.Message, "application/json");
            }
        }
    }
}