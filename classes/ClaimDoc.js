/* Класс документа */
export default class ClaimDoc {
  id;
  docId;
  ownerId;
  docTypeId;
  active;
  fromDate;
  name;
  ext;
  src;
  description;
  userId;
  userLogin;
  userFullName;

  constructor(props) {
    this.id = props.id;
    this.docId = props.docId;
    this.ownerId = props.ownerId;
    this.docTypeId = props.docTypeId;
    this.active = props.active;
    this.fromDate = props.fromDate || props.createDate;
    this.name = props.name;
    this.ext = props.ext;
    this.src = props.src;
    this.description = props.description;
    this.userId = props.userId || props.user?.id;
    this.userLogin = props.userLogin || props.user?.login;
    this.userFullName = props.userFullName || props.user?.fullName;
  }
}
