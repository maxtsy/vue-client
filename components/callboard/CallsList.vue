<template>
    <div class="calls-list">
        <v-col cols="12" class="px-3">
            <v-row no-gutters class="py-3">
                <v-col cols="12">                   
                    <v-card outlined>
                        <v-expansion-panels flat v-model="expansionPanels.searchResults">
                            <v-expansion-panel>
                                <v-expansion-panel-header>
                                    <template v-slot:default>
                                        <div class="text-uppercase font-weight-medium blue-grey--text text--darken-2 order-1">Звонки</div>
                                        <div class="v-expansion-panel-header__icon order-0" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light blue-grey--text text--darken-2" style="font-size:12px;">keyboard_arrow_down</i></div>
                                    </template>
                                    <template v-slot:actions>
                                        &nbsp;
                                    </template>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-data-table
                                        :headers="headers"
                                        :items="calls"
                                        hide-default-footer
                                        class="calls-list-results"
                                    >
                                        <template v-slot:item.ext="{ item }">
                                            <div v-if="item.ext == 'mp3'">
                                                <audio controls>
                                                    <source v-bind:src="item.src" type="audio/mp3" />
                                                    Ваш браузер не поддерживает тэг audio!
                                                </audio>  
                                            </div>                                             
                                            <div v-else>                            
                                                <a v-bind:href="item.src" target="_blank">{{item.name}}.{{item.ext}}</a>
                                            </div>                             
                                        </template>                                        
                                    </v-data-table>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </div>
</template>

<script>
    'use strict'    
    
    export default {
        name: 'CallsList',

        props: {},

        data () {
            return {
                calls: [],
                loading: false,

                expansionPanels: {
                    searchResults: 0
                },
                headers: [
                    {
                        text: 'ID',
                        align: 'start',
                        sortable: false,
                        value: 'id',
                        /* divider: true, */
                        width: 69
                    },
                    { text: 'Статус звонка', sortable: false, value: 'state' },
                    { text: 'Время звонка', sortable: false, value: 'startDate' },
                    { text: 'Входящий номер', sortable: false, value: 'callerNumber' },
                    { text: 'ID обращения', sortable: false, value: 'claimId' },
                    { text: 'Длилось, сек', sortable: false, value: 'duration' },
                    { text: 'Плеер', sortable: false, value: '' },
                ]
            }
        },

        created () {
            const vm = this;
            this.$callBoardHub.$on('callboard-list', (response) => { vm.calls = response.msg })
        }
    }
</script>