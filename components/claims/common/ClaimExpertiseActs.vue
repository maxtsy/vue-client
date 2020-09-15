<template>
    <v-card outlined class="claim-exp-acts mt-6">
        <v-expansion-panels flat v-model="expansionPanels.acts">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default>
                        <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                        <div style="color:#455A64;">АКТЫ ЭКСПЕРТИЗ</div>
                    </template>
                    <template v-slot:actions>&nbsp;</template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="headers"
                        :items="expActs"
                        hide-default-footer
                        class="claim-exp-acts-results"
                    >
                        <template v-slot:item.active="{ item }">
                            {{ item.active ? 'Да' : 'Нет' }}
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                small
                                @click.stop="removeNote(item)"
                            >
                                delete
                            </v-icon>                         
                        </template>
                    </v-data-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
    
</template>
<script>
    'use strict'

    import { apiClaimExpActsMixin } from '@/../mixins/apiClaimExpActsMixin'    
    import { ClaimDoc } from '@/../classes/ClaimDoc'

    export default {
        name: 'ClaimExpertiseActs',
        props: {        
            clmId: Number,
            clmStateId: Number
        },
        mixins: [ apiClaimExpActsMixin ],
        watch: {},
        data () {
            return {
                expActs: [],
                expansionPanels: {
                    acts: 0
                },
                headers: [
                    /* { text: '#', sortable: false, value: 'id' }, */
                    { text: 'Документ', sortable: false, value: 'deacription' },                    
                    { text: 'Активный', sortable: false, value: 'active' },                    
                    { text: 'Дата создания', value: 'fromDate', sortable: false, },
                    /* { text: 'Пользователь', value: 'userId' }, */
                    /* { text: '', sortable: false, value: 'actions' }, */
                ],

                flags: {},
                
                selectedId: undefined
            }
        },
        computed: {
            disabled () {
                return this.clmStateId === 21;
            },
        },
        methods: {
            setExpActs (docs) {
                this.expActs = []

                for (let i = 0; i < docs.length; i++) {
                    const item = docs[i];
                    var doc = new ClaimDoc();
                                                            
                    doc.id = undefined;/* item.File.Id; */
                    doc.docId = item.DocId;
                    doc.ownerId = item.Id;
                    doc.active = item.Active;
                    doc.fromDate = item.CreateDate;
                    doc.name = undefined;/* item.File.Name; */
                    doc.ext = undefined; /* item.File.Ext.toLowerCase(); */
                    doc.description = item.Description;
                    doc.src = undefined;/* OMInsurance.host + OMInsurance.path + "/File/FileById?filename=" + doc.id; */
                    doc.userId = item.User.Id;
                    doc.userLogin = item.User.Login;
                    doc.userFullName = item.User.Fullname;                

                    this.expActs.push(doc);
                }     
                this.$emit('set-expacts-length', this.expActs.length)           
            },
            getExpActs (claimId) {
                let vm = this

                this.apiGetClaimExpActs(claimId)
                    .then((response) => {
                        if (response.result === "Ok") {
                            vm.setExpActs(JSON.parse(response.data.docs))                       
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
            clear () {
                this.expActs = [];
                this.selectedId = undefined;
            },
        },
        created () {
            this.getExpActs(this.clmId)
        },
    }
</script>