using System;
using System.Collections.Generic;
using System.Data;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using OMInsurance.DataAccess.Core;
using OMInsurance.DataAccess.Core.Helpers;
using OMInsurance.DataAccess.Materializers;
using OMInsurance.Entities;
using OMInsurance.Entities.Core;
using OMInsurance.Entities.Searching;
using OMInsurance.Entities.Sorting;
using NLog;
using System.Globalization;

namespace OMInsurance.DataAccess.DAO
{
    public class AgreeDao : ItemManagedDao
    {
        #region Ctors
        private AgreeDao() : base(DatabaseAliases.OMInsuranceOracleManaged) { }
        #endregion
        #region Singleton
        private static readonly Lazy<AgreeDao> lazy = new Lazy<AgreeDao>(() => new AgreeDao());
        public static AgreeDao Instance { get { return lazy.Value; } }
        #endregion
        #region Props
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        #endregion
        #region Methods        
        public DataPage<ClientVisitInfo> ClientVisit_Find(
            ClientVisitSearchCriteria criteria,
            List<SortCriteria<ClientVisitSortField>> sortCriteria,
            PageRequest pageRequest)
        {
            var parameters = new List<OracleParameter>();

            var totalCount = new OracleParameter() { ParameterName = "Total_count", OracleDbType = OracleDbType.Int64, Direction = ParameterDirection.Output };
            var deliveryCenterIdsHasValue = criteria.DeliveryCenterIds.Count > 0;
            var deliveryCenterIds = new OracleParameter() { ParameterName = "DeliveryCenterIds", OracleDbType = OracleDbType.Int32, CollectionType = OracleCollectionType.PLSQLAssociativeArray, Value = deliveryCenterIdsHasValue ? criteria.DeliveryCenterIds.ToArray() : (object)new OracleDecimal[1] { OracleDecimal.Null }, Size = deliveryCenterIdsHasValue ? criteria.DeliveryCenterIds.Count : 1 };
            var statusIdsHasValue = criteria.StatusIds.Count > 0;
            var statusIds = new OracleParameter() { ParameterName = "StatusIds", OracleDbType = OracleDbType.Char, CollectionType = OracleCollectionType.PLSQLAssociativeArray, Value = statusIdsHasValue ? criteria.StatusIds.ToArray() : (object)new OracleString[1] { OracleString.Null }, Size = statusIdsHasValue ? criteria.StatusIds.Count : 1 };
            var scenarioIdsHasValue = criteria.ScenarioIds.Count > 0;
            var scenarioIds = new OracleParameter() { ParameterName = "ScenarioIds", OracleDbType = OracleDbType.Int32, CollectionType = OracleCollectionType.PLSQLAssociativeArray, Value = scenarioIdsHasValue ? criteria.ScenarioIds.ToArray() : (object)new OracleDecimal[1] { OracleDecimal.Null }, Size = scenarioIdsHasValue ? criteria.ScenarioIds.Count : 1 };

            var clientIdsHasValue = criteria.ClientIds.Count > 0;
            var clientIds = new OracleParameter() { ParameterName = "ClientIds", OracleDbType = OracleDbType.Int64, CollectionType = OracleCollectionType.PLSQLAssociativeArray, Value = clientIdsHasValue ? criteria.ClientIds.ToArray() : (object)new OracleDecimal[1] { OracleDecimal.Null }, Size = clientIdsHasValue ? criteria.ClientIds.Count : 1 };

            var upNumbersHasValue = criteria.UnifiedPolicyNumbers.Count > 0;
            var unifiedPolicyNumbers = new OracleParameter() { ParameterName = "UnifiedPolicyNumbers", OracleDbType = OracleDbType.Varchar2, CollectionType = OracleCollectionType.PLSQLAssociativeArray, Value = upNumbersHasValue ? criteria.UnifiedPolicyNumbers.ToArray() : (object)new OracleDecimal[1] { OracleDecimal.Null }, Size = upNumbersHasValue ? criteria.UnifiedPolicyNumbers.Count : 1 };

            parameters.AddRange(new List<OracleParameter> {
                new OracleParameter() { ParameterName = "RegionId", OracleDbType = OracleDbType.Int64, Value = criteria.RegionId },
                new OracleParameter() { ParameterName = "CompanyId", OracleDbType = OracleDbType.Int64, Value = criteria.CompanyId },
                new OracleParameter() { ParameterName = "ClientVisitId", OracleDbType = OracleDbType.Int64, Value = criteria.ClientVisitId },
                new OracleParameter() { ParameterName = "ClientId", OracleDbType = OracleDbType.Int64, Value = criteria.ClientId },
                new OracleParameter() { ParameterName = "TaskId", OracleDbType = OracleDbType.Int64, Value = criteria.TaskId },
                new OracleParameter() { ParameterName = "Lastname", OracleDbType = OracleDbType.Varchar2, Value = criteria.Lastname },
                new OracleParameter() { ParameterName = "Firstname", OracleDbType = OracleDbType.Varchar2, Value = criteria.Firstname },
                new OracleParameter() { ParameterName = "Secondname", OracleDbType = OracleDbType.Varchar2, Value = criteria.Secondname },
                new OracleParameter() { ParameterName = "Birthday", OracleDbType = OracleDbType.Date, Value = criteria.Birthday },
                new OracleParameter() { ParameterName = "BirthdayYearFrom", OracleDbType = OracleDbType.Varchar2, Value = criteria.BirthdayYearFrom },
                new OracleParameter() { ParameterName = "BirthdayYearTo", OracleDbType = OracleDbType.Varchar2, Value = criteria.BirthdayYearTo },
                new OracleParameter() { ParameterName = "SNILS", OracleDbType = OracleDbType.Varchar2, Value = criteria.SNILS },
                new OracleParameter() { ParameterName = "UnifiedPolicyNumber", OracleDbType = OracleDbType.Varchar2, Value = criteria.UnifiedPolicyNumber },
                new OracleParameter() { ParameterName = "PolicyNumber", OracleDbType = OracleDbType.Varchar2, Value = criteria.PolicyNumber },
                new OracleParameter() { ParameterName = "TemporaryPolicyNumber", OracleDbType = OracleDbType.Varchar2, Value = criteria.TemporaryPolicyNumber },
                new OracleParameter() { ParameterName = "TemporaryPolicyDateFrom", OracleDbType = OracleDbType.Date, Value = criteria.TemporaryPolicyDateFrom },
                new OracleParameter() { ParameterName = "TemporaryPolicyDateTo", OracleDbType = OracleDbType.Date, Value = criteria.TemporaryPolicyDateTo },
                new OracleParameter() { ParameterName = "IssueDate", OracleDbType = OracleDbType.Date, Value = criteria.IssueDate },
                new OracleParameter() { ParameterName = "IssueDateFrom", OracleDbType = OracleDbType.Date, Value = criteria.IssueDateFrom },
                new OracleParameter() { ParameterName = "IssueDateTo", OracleDbType = OracleDbType.Date, Value = criteria.IssueDateTo },
                new OracleParameter() { ParameterName = "BoxYearFrom",  OracleDbType = OracleDbType.Varchar2, Value = criteria.BoxYearFrom },
                new OracleParameter() { ParameterName = "BoxYearTo",  OracleDbType = OracleDbType.Varchar2, Value = criteria.BoxYearTo },
                new OracleParameter() { ParameterName = "Comment_", OracleDbType = OracleDbType.Varchar2, Value = criteria.Comment },
                new OracleParameter() { ParameterName = "OperatorId", OracleDbType = OracleDbType.Int64, Value = criteria.UserId },
                new OracleParameter() { ParameterName = "SalesChannelId", OracleDbType = OracleDbType.Int64, Value = criteria.SalesChannelId },
                new OracleParameter() { ParameterName = "AgentId", OracleDbType = OracleDbType.Int64, Value = criteria.CivilContractAgentId },
                new OracleParameter() { ParameterName = "DeferredDate", OracleDbType = OracleDbType.Int64, Value = criteria.DeferredDate ? 2 : 1 },
                new OracleParameter() { ParameterName = "Phone", OracleDbType = OracleDbType.Varchar2, Value = criteria.Phone },

                deliveryCenterIds,
                statusIds,
                scenarioIds,
                clientIds,
                unifiedPolicyNumbers,

                new OracleParameter() { ParameterName = "HasValue", OracleDbType = OracleDbType.Int32, Value = criteria.IsNull ? 0 : 1 },

                new OracleParameter() { ParameterName = "Page_size", OracleDbType = OracleDbType.Int32, Value = pageRequest.PageSize },
                new OracleParameter() { ParameterName = "Page_number", OracleDbType = OracleDbType.Int32, Value = pageRequest.PageNumber },
                new OracleParameter() { ParameterName = "Client_visits", OracleDbType = OracleDbType.RefCursor, Direction = ParameterDirection.Output },
                totalCount
            });

            List<ClientVisitInfo> clients = Execute_GetList(ClientVisitInfoMaterializer.Instance, "procedure", parameters);

            return ManagedDaoHelper.GetDataPage(clients, totalCount, pageRequest);
        }
        
        public Agree ClientVisit_Get(long id)
        {
            try
            {
                List<OracleParameter> parameters = new List<OracleParameter>();
                parameters.AddRange(new List<OracleParameter> {
                    new OracleParameter() { ParameterName = "i_agree_id", OracleDbType = OracleDbType.Int64, Value = id },
                    new OracleParameter() { ParameterName = "o_agree_rc", OracleDbType = OracleDbType.RefCursor, Direction = ParameterDirection.Output }
                });

                Agree cv = Execute_Get(AgreeMaterializer.Instance, "procedure", parameters);

                return cv;
            }
            catch (OracleException ex)
            {
                Logger.Error("ClientVisit_Get: " + id + "\n\r" + ex.Message);

                return null;
            }

        }       

        public AgreeBase GetAgreeBase(long id)
        {
            try
            {
                List<OracleParameter> parameters = new List<OracleParameter>();
                parameters.AddRange(new List<OracleParameter> {
                    new OracleParameter() { ParameterName = "i_agree_id", OracleDbType = OracleDbType.Int64, Value = id },
                    new OracleParameter() { ParameterName = "o_agree_rc", OracleDbType = OracleDbType.RefCursor, Direction = ParameterDirection.Output }
                });

                AgreeBase cv = Execute_Get(AgreeBaseMaterializer.Instance, "procedure", parameters);

                return cv;
            }
            catch (OracleException ex)
            {
                Logger.Error("GetAgreeBase: " + id + "\n\r" + ex.Message);

                return null;
            }
        }

        

        public void SendEmailIfIssuePolicyFail(long agreeId, long userId)
        {
            Execute_StoredProcedure("function", new List<OracleParameter>() {
                new OracleParameter() { ParameterName = "p_agreeid", OracleDbType = OracleDbType.Int64, Value = agreeId },
                new OracleParameter() { ParameterName = "p_userid", OracleDbType = OracleDbType.Int64, Value = userId }
            });
        }
        #endregion        
    }
}
