export default class ClientEventMember {
  id;
  fullname;
  surname;
  firstname;
  secondname;
  birthDate;
  address;
  phone;
  email;
  sexId;

  constructor(props) {
    this.setData(props);
  }

  setData(props = {}) {
    this.id = props.id;
    this.fullname = props.fullname;
    this.surname = props.surname;
    this.firstname = props.firstname;
    this.secondname = props.secondname;
    this.birthDate = props.birthDate;
    this.address = props.address;
    this.phone = props.phone;
    this.email = props.email;
    this.sexId = props.sexId;

    if (!this.firstname && !this.secondname && !this.surname && this.fullname) {
      const [surname, firstname, secondname] = this.fullname.split(" ");
      this.surname = surname;
      this.firstname = firstname;
      this.secondname = secondname;
    }
  }

  getAspModel() {
    return {
      Id: this.id,
      Fullname: this.fullname,
      Surname: this.surname,
      Firstname: this.firstname,
      Secondname: this.secondname,
      BirthDate: this.birthDate,
      Address: this.address,
      Phone: this.phone,
      Email: this.email,
      SexId: this.sexId,
    };
  }
}
