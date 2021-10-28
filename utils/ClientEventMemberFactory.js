import ClientEventMember from "@/../classes/ClientEventMember";

export default class ClientEventMemberFactory {
  static create(props = {}) {
    try {
      return new ClientEventMember(props);
    } catch (error) {
      console.log(error);
    }
  }
}
