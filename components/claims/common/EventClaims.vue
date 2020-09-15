<template>
    <v-card outlined class="event-claims mt-6">
        <v-expansion-panels flat v-model="expansionPanels.claims">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default>
                        <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                        <div style="color:#455A64;">ВСЕ ОБРАЩЕНИЯ</div>
                    </template>
                    <template v-slot:actions>&nbsp;</template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="headers"
                        :items="claims"
                        hide-default-footer
                        class="event-claims-results"
                    >                       
                    </v-data-table>
                </v-expansion-panel-content>
            </v-expansion-panel>

        </v-expansion-panels>
    </v-card>
</template>
<script>
    'use strict'
    
    import { requestsMixin } from '@/../mixins/requestsMixin'
    import { claimRefsMixin } from '@/../mixins/claimRefsMixin'

    export default {
        name: 'EventClaims',
        props: {
            evntId: Number
        },
        mixins: [ requestsMixin, claimRefsMixin ],
        watch: {
            evntId (val) {
                if (val) {
                    this.getClaims(val)
                }
            }
        },
        data () {
            return {
                claims: [],
                expansionPanels: {
                    claims: 0
                },
                headers: [
                    { text: '#', value: 'id', sortable: false },
                    { text: 'Дата создания', value: 'fromDate', sortable: false },
                    { text: 'Тип', value: 'typeName', sortable: false },                    
                    { text: 'Состояние', value: 'stateName', sortable: false },                    
                    { text: 'Id события', value: 'eventId', sortable: false },
                ],
            }
        },
        methods: {
            setClaims (claims) {     
                this.claims = []

                for (let c = 0; c < claims.length; c++) {
                    const element = claims[c];
                    // возвращается дата и время, хватаем дату
                    let occurDate = element.OccurDate.slice(0, 10);
                    var type = this.refs.claimTypes.find(item => item.Id === element.TypeId);
                    var state = this.refs.claimStates.find(item => item.Id === element.StateId);

                    let claim = {
                        id : element.Id,
                        eventId : element.EventId,
                        fromDate : occurDate,
                        typeId : element.TypeId,
                        typeName : type.Name,
                        stageId : element.StageId,
                        stateName: state.Name
                    };
                    
                    this.claims.push(claim);
                }
                
                this.$emit('set-eventclaims-length', this.claims.length)
            },
            getClaims (eventId) {
                let vm = this

                this.apiGetEventClaims(eventId)
                    .then((response) => {
                        if (response.result === "Ok") {
                            vm.setClaims(JSON.parse(response.data.claims))                       
                        } else {
                            // todo: сообщение об ошибке
                        }
                    })
                    .catch((response) => {
                        if (response.status === 401) {
                            alert("Перезагрузите страницу и авторизуйтесь заново!");
                        }
                    })
            },
            async apiGetEventClaims (eventId) {
                const { data } = await this.getEventClaims(eventId);

                return data;                
            },
        },
    }
</script>