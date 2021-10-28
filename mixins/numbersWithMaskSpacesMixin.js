import { mapActions } from "vuex";
export default {
  props: {
    value: [Number, String],
    rules: Array,
    disabled: Boolean,
    label: String,
  },

  computed: {
    number() {
      const spaceOverDigits = this.spaceOverDigits;
      if (this.value) {
        return this.value
          .split("")
          .map((it) => Number.parseInt(it))
          .filter((it) => it === 0 || it)
          .map((v, i) => (i % spaceOverDigits == 0 ? ` ${v}` : v))
          .join("")
          .trim();
      }
      return "";
    },
  },

  methods: {
    ...mapActions(["addSuccessNotification", "addErrorNotification"]),
    copyText() {
      if (this.value) {
        this.copyTextToClipboard(this.value);
      }
    },

    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      try {
        textArea.value = text;

        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
      } catch (err) {
        this.addErrorNotification("Копирование завершилось ошибкой!");
      } finally {
        document.body.removeChild(textArea);
      }
    },

    async copyTextToClipboard(text) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text);
      } else {
        await navigator.clipboard.writeText(text);
      }
      this.addSuccessNotification(`Текст "${text}" успешно скопирован!`);
    },

    textChanged(val) {
      if (val) {
        const maxDigits = this.maxDigits;
        const newValue = val
          .split(" ")
          .join("")
          .substring(0, maxDigits);

        if (this.value != newValue) {
          return this.$emit("input", newValue);
        }
      } else {
        return this.$emit("input", null);
      }
    },
  },
};
