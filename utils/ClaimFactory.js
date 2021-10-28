import Claim from "@/../classes/Claim";
import ClientInfoFactory from "@/../utils/ClientInfoFactory";

export default class ClaimFactory {
  static create(props = {}) {
    try {
      return new Claim(props);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Создание формы быстрого обращения за счёт user, agree, callerNumber
   * @param { user: User, callerNumber: string, agree: Agree } data
   */
  static createByUserAgreeCallerNumber(data) {
    const { user, callerNumber, oldClaim } = data;
    try {
      if (oldClaim) {
        return ClaimFactory.createByOldClaim(data);
      }
      const { isOperatorCallCenter, isOperatorClaimer } = user;

      if (callerNumber) {
        return ClaimFactory.createByCallerNumberOrOperatorCallCenter(data);
      } else if (isOperatorClaimer) {
        return ClaimFactory.createByOperatorClaimer(data);
      } else if (isOperatorCallCenter) {
        return ClaimFactory.createByCallerNumberOrOperatorCallCenter(data);
      } else {
        return ClaimFactory.createByOperatorClaimer(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * @param { user: User, callerNumber: string, agree: Agree } data
   * @returns
   */
  static createByCallerNumberOrOperatorCallCenter(data) {
    const { user, callerNumber, agree } = data;
    try {
      const { regionId, companyId } = user;
      const { id, newUnifiedPolicyNumber, temporaryPolicyNumber } = agree || {};

      const client = ClientInfoFactory.createByAgree(agree);
      const representative = ClientInfoFactory.createByRepresentative(
        agree?.representative
      );
      const applicant = ClientInfoFactory.create({
        ...client,
        phoneMobile: callerNumber,
      });

      //-- code: "PHONE", id: 2, name: "Телефон"
      // this.eventId = 1; //-- code: "ST", id: 1, name: "Устно"
      // this.typeId = 3; //-- code: "consult", id: 3, name: "Консультация";
      // this.reasonId = 81; // code: "4.2", id: 81, name: "Oб обеспечении полисами ОМС иностранных граждан, беженцев"
      return new Claim({
        eventId: 1,
        typeId: 3,
        reasonId: 81,
        reciptTypeId: 2,
        regionId,
        companyId,
        agreeId: id,
        enp: newUnifiedPolicyNumber,
        tpn: temporaryPolicyNumber,

        client,
        applicant,
        representative,
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * @param { user: User, agree: Agree } data
   * @returns
   */
  static createByOperatorClaimer(data) {
    const { user, agree } = data;
    try {
      const { regionId, companyId } = user;
      const { id, newUnifiedPolicyNumber, temporaryPolicyNumber } = agree || {};

      const client = ClientInfoFactory.createByAgree(agree);
      const applicant = ClientInfoFactory.create(client);
      const representative = ClientInfoFactory.createByRepresentative(
        agree?.representative
      );

      //-- code: "PHONE", id: 2, name: "Телефон"
      //-- code: "WR", id: 2, name: "Письменно"
      //-- code: "complaint", id: 1, name: "Жалоба"
      return new Claim({
        eventId: 2,
        typeId: 1,
        reciptTypeId: 2,
        regionId,
        companyId,
        agreeId: id,
        enp: newUnifiedPolicyNumber,
        tpn: temporaryPolicyNumber,

        client,
        applicant,
        representative,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static createByOldClaim({ oldClaim, agree, callerNumber }) {
    const { id, newUnifiedPolicyNumber, temporaryPolicyNumber } = agree || {};
    const client = ClientInfoFactory.createByAgree(agree);

    const applicant = ClientInfoFactory.create({
      ...client,
      phoneMobile: callerNumber,
    });

    return new Claim({
      ...oldClaim,
      agreeId: id,
      enp: newUnifiedPolicyNumber,
      tpn: temporaryPolicyNumber,

      client,
      applicant,
    });
  }
}
