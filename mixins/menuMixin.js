export const menuMixin = {
  data() {
    return {
      /* меню */
      menuItems: [
        {
          icon: "policy",
          text: "Поиск",
          href: OMInsurance.host + OMInsurance.path + "/ClientVisit/Actuals",
          path: "ClientVisit",
        },
        {
          icon: "chat_bubble",
          text: "Обращения",
          href: OMInsurance.host + OMInsurance.path + "/Claim/Index",
          path: "Claim",
        },
        {
          icon: "phone_in_talk",
          text: "Коллборд",
          href: OMInsurance.host + OMInsurance.path + "/Callboard/Index",
          path: "Callboard",
        },
        {
          icon: "menu_book",
          text: "ЕРЗЛ",
          href: OMInsurance.host + OMInsurance.path + "/",
          path: "",
        },
        {
          icon: "pie_chart",
          text: "Отчеты",
          href: OMInsurance.host + OMInsurance.path + "/",
          path: "",
        },
        {
          icon: "description",
          text: "Анкеты",
          href: OMInsurance.host + OMInsurance.path + "/Survey/Index",
          path: "Survey",
        },
        {
          icon: "folder",
          text: "Полисы",
          href: OMInsurance.host + OMInsurance.path + "/Plcbox/Index",
          path: "Plcbox",
        },
        {
          icon: "assignment_ind",
          text: "Агент",
          href: OMInsurance.host + OMInsurance.path + "/Account/Index",
          path: "Account",
        },
        {
          icon: "help",
          text: "Помощь",
          href: OMInsurance.host + OMInsurance.path + "/Docs/Index",
          path: "Docs",
        },
      ],
    };
  },
};
