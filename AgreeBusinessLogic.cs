using OMInsurance.DataAccess.DAO;
using OMInsurance.Entities;
using OMInsurance.Entities.Core.Exeptions;
using OMInsurance.Interfaces;

namespace OMInsurance.BusinessLogic
{
    public class AgreeBusinessLogic : IAgreeBusinessLogic
    {
        public void SendEmailIfIssuePolicyFail(long agreeId, long userId) => AgreeDao.Instance.SendEmailIfIssuePolicyFail(agreeId, userId);
        /// <summary>
        /// Returnes client visit by identifier
        /// </summary>
        /// <param name="id">Identifier of specified client visit</param>
        /// <returns>Instance of client visit</returns>
        public AgreeBase GetAgreeBase(long id)
        {
            AgreeBase agree = AgreeDao.Instance.GetAgreeBase(id);
            if (agree == null)
            {
                throw new DataObjectNotFoundException(string.Format("Заявление клиента с идентификатором {0} не найдено", id));
            }
            return agree;
        }
    }
}
