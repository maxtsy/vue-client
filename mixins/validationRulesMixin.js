export const validationRulesMixin = {
  methods: {
    requiredRule(v, msg = "Обязательное поле") {
      if (typeof v === "string") {
        return !!v.trim() || msg;
      } else {
        return !!v || msg;
      }
    },
  },
};
