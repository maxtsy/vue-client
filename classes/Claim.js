import ClientInfoFactory from "@/../utils/ClientInfoFactory";

export default class Claim {
  regionId;
  companyId;
  fromDate;
  stateId;
  typeId;
  eventId;
  sourceId;
  reasonId;
  subjectId;
  reciptTypeId;
  munitipalId;
  question;
  answer;
  note;
  repeated;

  agreeId;
  policyInfo;
  enp;
  tpn;
  client;
  representative;
  applicant;
  items;

  constructor(props) {
    this.setData(props);
  }

  setData(props) {
    this.regionId = props.regionId || null;
    this.companyId = props.companyId || null;
    this.fromDate = props.fromDate || new Date();
    this.stateId = props.stateId || null;
    this.typeId = props.typeId || null;
    this.eventId = props.eventId || null;
    this.sourceId = props.sourceId || null;
    this.reasonId = props.reasonId || null;
    this.subjectId = props.subjectId || null;
    this.reciptTypeId = props.reciptTypeId || null;
    this.munitipalId = props.munitipalId || null;
    this.question = props.question || null;
    this.answer = props.answer || null;
    this.note = props.note || null;
    this.repeated = props.repeated || null;
    this.agreeId = props.agreeId || null;
    this.policyInfo = props.policyInfo || null;
    this.enp = props.enp || null;
    this.tpn = props.tpn || null;

    this.client = ClientInfoFactory.create(props.client);
    this.representative = ClientInfoFactory.create(props.representative);
    this.applicant = ClientInfoFactory.create(props.applicant);
    this.items = props.items ? [...props.items] : [];
  }

  getAspModel() {
    return {
      Id: null,
      EventId: null,
      RegionId: this.regionId,
      CompanyId: this.companyId,
      AgreeId: this.agreeId,
      OccurDate: this.fromDate,
      MunitipalityId: this.munitipalId,
      /* eventtypeid */
      EventTypeId: this.eventId,
      ClaimTypeId: this.typeId,
      ReasonId: this.reasonId,
      RecipTypeId: this.reciptTypeId,
      Question: this.question,
      Answer: this.answer,
      Description: this.description,
      Repeated: this.repeated ? -1 : 0,
      PlcSeries: this.tpn,
      PlcNumber: this.enp,
      Applicant: this.applicant?.getAspModel(),
      Client: this.client?.getAspModel(),
      Representative: this.representative?.getAspModel(),
    };
  }
}
