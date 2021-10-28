using System;
using System.Linq;
using System.Collections.Generic;
using OMInsurance.DataAccess.Core;
using OMInsurance.DataAccess.DAO;
using OMInsurance.Entities;
using OMInsurance.Entities.Core;

namespace OMInsurance.DataAccess.Materializers
{
    public class AgreeBaseMaterializer : IManagedMaterializer<AgreeBase>
    {        
        #region Ctors
        private AgreeBaseMaterializer() {}
        #endregion
        #region Singleton
        private static readonly Lazy<AgreeBaseMaterializer> lazy = new Lazy<AgreeBaseMaterializer>(() => new AgreeBaseMaterializer());
        public static AgreeBaseMaterializer Instance { get { return lazy.Value; } }
        #endregion
        #region Methods        
        public AgreeBase Materialize(ManagedDataReaderAdapter dataReader) => Materialize_List(dataReader).FirstOrDefault();
        public List<AgreeBase> Materialize_List(ManagedDataReaderAdapter dataReader)
        {
            List<AgreeBase> items = new List<AgreeBase>();

            while (dataReader.Read())
            {
                var item = ReadItemFields(dataReader);                          

                items.Add(item);
            }

            return items;
        }
        public AgreeBase ReadItemFields(ManagedDataReaderAdapter dataReader, AgreeBase item = null)
        {
            if (item == null)
                item = new AgreeBase();

            // Инфа из plc_docs
            item.Id = dataReader.GetInt64("ID");
            item.ClientId = dataReader.GetInt64("HOLDERID");
            item.PackId = dataReader.GetInt64("PACKID");
            item.AverNo = dataReader.GetInt64("AVERNO");
            item.InheritId = dataReader.GetInt64Null("INHERITID");

            item.CreateDate = dataReader.IsNull("CREATEDATE") ? DateTime.Now : dataReader.GetDateTime("CREATEDATE");
            item.UpdateDate = dataReader.HasField("MODIFYDATE") && !dataReader.IsNull("MODIFYDATE") ? dataReader.GetDateTime("MODIFYDATE") : DateTime.Now;
            item.SignDate = dataReader.GetDateTime("SIGNDATE");
            item.CancelDate = dataReader.GetDateTimeNull("CANCELDATE");

            item.AgentId = dataReader.GetInt64Null("AGENTID");
            item.OperatorId = dataReader.GetInt64Null("OPERATORID");
            item.UserId = dataReader.GetInt64Null("USERID"); 
            item.ConcultantId = dataReader.GetInt64Null("CONSULTANTID");

            item.ScenarioId = dataReader.GetInt64("OPERATIONTYPE");
            item.StageId = dataReader.GetInt64("STAGEID");
            item.DeliveryCenterId = dataReader.GetInt64("DEPARTID");

            item.ApplicationMethodId = dataReader.GetInt64Null("APPLICATIONMETHODID");
            item.ApplicationTypeId = dataReader.GetInt64Null("REQUESTYPE");
            item.ApplicationReasonId = dataReader.GetInt64Null("APPLYREASON");
            item.PetitionId = dataReader.GetInt64Null("PETITION");
            item.SmoReasonId = dataReader.GetInt64Null("SMOREASON");
            item.IssueBlankReasonId = dataReader.GetInt64Null("ISSUEBLANKREASON");
            item.IssueBlankTypeId = dataReader.GetInt64Null("ISSUEBLANKTYPE");

            item.Comment = dataReader.GetString("DESCRIPTION");

            item.DeferredDate = dataReader.GetBoolean("DEFERREDDATE");

            item.SourceId = dataReader.GetInt64("SOURCEID");
            item.SalesChannelId = dataReader.GetInt64Null("SALESCHANNELID");
            item.SourceInfoId = dataReader.GetInt64Null("SOURCEINFOID");

            item.State = dataReader.GetString("STATE");
            item.TfomsId = dataReader.GetString("TFOMS_ID");

            item.RepresentativeAgreeId = dataReader.GetInt64Null("DELEGAT_AGREEID");

            item.NewClientInfoId = dataReader.GetInt64("PERSINFOID");
            item.OldClientInfoId = dataReader.GetInt64Null("PERSINFOID_PREV");
            item.NewDocumentId = dataReader.GetInt64("CLNDOCID");
            item.OldDocumentId = dataReader.GetInt64Null("CLNDOCID_PREV");
            item.NewForeignDocumentId = dataReader.GetInt64("CLNDOCADDID");
            item.OldForeignDocumentId = dataReader.GetInt64Null("CLNDOCADDID_PREV");
            item.LivingAddressId = dataReader.GetInt64("ADDRID");
            item.RegistrationAddressId = dataReader.GetInt64Null("ADDRREGID");
            item.RepresentativeId = dataReader.GetInt64Null("DELEGATEID");
            item.RepresentativePersId = dataReader.GetInt64Null("DELEGAT_PERSINFOID");
            item.RepresentativeDocId = dataReader.GetInt64Null("DELEGAT_CLNDOCID");
            item.AttachmentId = dataReader.GetInt64Null("ATTACHID");

            item.CurPolicyId = dataReader.GetInt64("CURPOLICYID");
            item.OldPolicyId = dataReader.GetInt64Null("OLDPOLICYID");
            item.PolicyInfoId = dataReader.GetInt64("POLICYINFOID");

            item.PolicyInfo.Id = dataReader.GetInt64("POLICYINFOID");
            item.PolicyInfo.TemporaryPolicyNumber = dataReader.GetString("BLANKNO");
            item.PolicyInfo.TemporaryPolicyDate = dataReader.GetDateTimeNull("CERTIFFROM");
            item.PolicyInfo.TemporaryPolicyExpirationDate = dataReader.GetDateTimeNull("CERTIFTO");
            item.PolicyInfo.PolicyBlankSeries = dataReader.GetString("BLANKOMSSERIA");
            item.PolicyInfo.PolicyBlankNumber = dataReader.GetString("BLANKOMSNO");
            item.PolicyInfo.PolicyBlankIssueDate = dataReader.GetDateTimeNull("BLANKOMSDATE");

            item.PolicyInfo.FomsPolicyBlankNumber = dataReader.GetString("FOMSBLANKNO");

            item.PolicyInfo.CarrierId = dataReader.GetInt64Null("BLANKTYPE");

            item.PolicyInfo.GOZNAKTypeId = dataReader.GetInt64Null("GOZNAK");

            item.RegionId = dataReader.GetInt64("REGIONID");
            item.CompanyId = dataReader.GetInt64("COMPANYID");

            return item;
        }                
        #endregion
    }
}
