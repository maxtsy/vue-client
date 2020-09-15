<template>
    <div class="claim-reasons">
        <v-text-field
            @click.stop="flags.listClaimReasonsDialog = true"
            @click:clear="clear"
            v-model="reasonName"
            label="Причина"
            outlined
            clearable             
            hide-details="auto"
        >
            <template v-slot:append>
                <v-icon @click.stop="flags.listClaimReasonsDialog = true" color="secondary">arrow_drop_down</v-icon>
            </template>
        </v-text-field>
        <v-dialog
            v-model="flags.listClaimReasonsDialog"
            max-width="715"
            scrollable 
        >
            <v-card>
                <v-card-title>
                    <span class="subtitle-2" style="font-size: 1rem !important;">Выбрать причину обращения</span>
                    <v-spacer></v-spacer>
                    <v-btn @click="flags.listClaimReasonsDialog = false" icon><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text
                    style="height: 500px"
                    class="px-4"
                >
                    <v-treeview                        
                        @update:active="update"
                        :items="filtredClaimReasons"                        
                        activatable
                        dense
                    ></v-treeview>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-row no-gutters class="pa-4">
                        <v-col cols="12">
                            <v-btn @click.stop="save" depressed class="white" color="primary">
                                <template v-slot:default>
                                    Выбрать                                       
                                </template>                            
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
// todo: по идее св-ва должны быть обязательными, но так как родительский объект получает данные ассинхронно то данных нет и постояно падают warnings в консоль
// todo: не работает значение по дефолту переданные из родительской формы
    'use strict'
    export default {
        name: 'ClaimReasonsDialog',
        props: {
            claimTypeId: {
                type: Number,
                required: true
            },
            claimReasonId: {
                type: Number,
                required: true
            },
            claimReasons: {
                type: Array,
                required: true
            },
            refsClaimReasons: {
                type: Array,
                required: true
            }
        },
        watch: {
            claimReasonId (val) {
                if (val) {
                    this.set(this.claimReasonId)
                }
            }
        },      
        data () {
            return {
                flags: {
                    listClaimReasonsDialog: false
                },
                
                reasonId: null,
                reasonName: ''                
            }
        },
        computed: {
            filtredClaimReasons () {                
                let vm = this

                if (this.claimTypeId && this.claimReasons) {
                    let filtredClaimReasons = this.claimReasons.filter(function (item) { return item.id == vm.claimTypeId });
                                        
                    if (filtredClaimReasons.length)
                        return filtredClaimReasons[0]['children']
                    else
                        return []
                }
            },
            /* значение по дефолту */
            input () {
                const vm = this

                if (this.claimReasonId) {
                    let filtredClaimReasons = this.claimReasons.filter(function (item) { return item.id == vm.claimTypeId })
                    
                    const reason  = (filtredClaimReasons[0]['children']).filter((item) => item.id == vm.claimReasonId)
                    
                    return [{id: this.claimReasonId, name: 'Oб обеспечении полисами ОМС' }]
                } else {
                    return []
                }
            },
        },
        methods: {
            
            /**
             * устанавливает входящую причину
             */
            set (reasonId) {
                const vm = this
                this.reasonId = reasonId

                const reason  = this.refsClaimReasons.filter((item) => item.Id == vm.reasonId)
                
                if (reason.length) {
                    this.reasonName = reason[0].Name
                }

            },
            save () {
                const vm = this                
                
                const reason  = this.refsClaimReasons.filter((item) => item.Id == vm.reasonId)
                if (reason.length) {
                    this.reasonName = reason[0].Name
                }

                this.$emit('reason-selected', this.reasonId)
                this.close()
            },
            update (items) {                
                if (items) {
                    this.reasonId = items[0]
                }
            },
            close () {
                // this.reasonId = null
                this.flags.listClaimReasonsDialog = false
            },
            clear (e) {
                this.$emit('reason-selected', null)
            }
        },        
    }
</script>