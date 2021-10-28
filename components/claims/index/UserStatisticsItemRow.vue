<template>
  <v-row>
    <v-col :cols="nameWidthCols" class="py-2">
      <div
        class="blue-dark--text"
        style="font-weight: 400; line-height: 12px; letter-spacing: 0.4px;font-size:0.75rem;"
      >
        {{ name }}
      </div>
    </v-col>
    <v-col
      :cols="12 - nameWidthCols"
      class="d-flex justify-start align-center py-2 px-0"
    >
      <v-progress-linear
        :color="color"
        height="10"
        :value="100"
        :buffer-value="100"
        :style="`border-radius: 0px 4px 4px 0px; width:${progressWidth}%`"
      ></v-progress-linear>
      <div
        class="blue-dark--text ml-1 text-no-wrap"
        style="font-weight: 400; line-height: 12px; letter-spacing: 0.4px;font-size:0.75rem;"
      >
        {{ value | numberSplitFilter }}
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "user-statistics-item-row",
  props: {
    value: { type: Number, default: 0 },
    name: { type: String },
    color: { type: String },
    nameWidthCols: { type: Number, default: 5 },
    maxValue: { type: Number, default: 100 },
    progressMaxWidth: { type: Number, default: 70 },
  },
  filters: {
    numberSplitFilter(value) {
      return value
        .toString()
        .split("")
        .reverse()
        .map((it, i) => (i % 3 == 2 ? ` ${it}` : it))
        .reverse()
        .join("");
    },
  },
  computed: {
    validPercentValue() {
      const max = Math.max(this.value, this.maxValue);
      const v = (this.value / max) * 100;
      if (!v) {
        return 0;
      }
      if (v < 2) {
        return 2;
      }
      if (v > 100) {
        return 100;
      }
      return v;
    },
    progressWidth() {
      const value = this.validPercentValue * (this.progressMaxWidth / 100);
      return Math.ceil(value);
    },
  },
};
</script>
