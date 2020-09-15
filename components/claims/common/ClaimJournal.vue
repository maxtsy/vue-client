<template>      
    <v-card outlined class="claim-journal mt-6">
        <v-expansion-panels flat v-model="expansionPanels.journal">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default>
                        <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                        <div style="color:#455A64;">ЖУРНАЛ</div>
                    </template>
                    <template v-slot:actions>&nbsp;</template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-default-footer
                        class="claim-journal-results"
                    >
                        <!-- <template v-slot:item.active="{ item }">
                            {{ item.active ? 'Да' : 'Нет' }}
                        </template> -->
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

    import { apiClaimJournalMixin } from '@/../mixins/apiClaimJournalMixin'    

    export default {
        name: 'ClaimJournal',
        props: {
            clmId: Number,
            clmStateId: Number
        }, 
        components: {},
        mixins: [ apiClaimJournalMixin ],
        /* следим */
        watch: {},
        
        data () {
            return {
                items: [],
                expansionPanels: {
                    journal: 0,
                },
                headers: [
                    /* { text: '#', sortable: false, value: 'id' }, */
                    { text: 'Дата создания', value: 'fromDate' },
                    { text: 'Тип сообщения', sortable: false, value: 'typeName' },                    
                    { text: 'Текст сообщения', sortable: false, value: 'message' },                    
                    /* { text: 'Пользователь', value: 'userId' }, */
                    /* { text: '', sortable: false, value: 'actions' }, */
                ],
                flags: {},
                /* строка выбранная в таблице */
                selectedId: undefined
            }
        },
        computed: {
            disabled () {
                return this.clmStateId === 21;
            },
        },
        methods: {            
            setJournal (items) {           
                this.items = []

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    var newItem = {
                        fromDate : item.EventDate,
                        userId : item.UserId,
                        userName : item.UserName,
                        typeName : item.TypeName,
                        message : item.Text
                    };                           
                    
                    this.items.push(newItem);
                }

                this.$emit('set-journal-length', this.items.length)
            }, 
            getJournal(claimId) {
                let vm = this

                this.apiGetClaimJournal(claimId)
                    .then((response) => {
                        if (response.result === "Ok") {
                            vm.setJournal(JSON.parse(response.data.journal))                       
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
                this.items = [];
                this.selectedId = undefined;
            },
        },
        created () {
            this.getJournal(this.clmId)
        },
    }
</script>