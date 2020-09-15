<template>
    <v-card outlined>
        <v-expansion-panels flat v-model="expansionPanels.searchResults">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default>
                        <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                        <div class="text-uppercase blue-grey--text" style="color:#455A64;">ОБРАЩЕНИЯ</div>
                    </template>
                    <template v-slot:actions>
                        <v-btn @click.native.stop="add" text type="button" color="#1A7555" :href="addHref" target="_blank">
                            <v-icon size="16" color="#1A7555">add_circle_outline</v-icon> Добавить
                        </v-btn>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="headers"
                        
                        :items="items"
                        :item-class="item => item.Id +''"
                        :items-per-page="perPage"
                        :server-items-length="total"                        
                        :page="paginationPageCurrent"  
                        :page-start="1"
                        :locale="'ru'"
                        @page-count="paginationPageCount = $event"                        
                        hide-default-footer                        
                        class="search-results"
                        :loading="loadingData"
                        loading-text="Загрузка... Пожалуйста подождите"
                    >
                        <template v-slot:item.Id="{ item }">
                            <a :href="itemHref + item.Id" target="_blank" class="text-decoration-none">
                                {{ item.Id }}
                            </a>
                        </template>
                    </v-data-table>
                    <v-row v-show="paginationPageCount > 0">
                        <v-col cols="4">
                            <v-pagination v-model="paginationPageCurrent" :page-start="1" :length="paginationPageCount" :total-visible="7" @input="pageMove"></v-pagination>    
                        </v-col>
                    </v-row>                    
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script>
    'use strict';

    export default {
        name: 'SearchResults',

        props: {
            items: Array,        
            perPage: Number,        
            total: Number,
            pageCurrent: Number,        
            pageCount: Number,
            loadingData: Boolean       
        },

        data () {
            return {  
                loading: false,

                expansionPanels: {                
                    searchResults: 0
                },
                headers: [
                    {
                        text: 'ID',
                        align: 'start',
                        sortable: false,
                        value: 'Id',
                        /* divider: true, */
                        width: 69
                    },
                    { text: 'Источник', sortable: false, value: 'RecipType.Name' },
                    { text: 'Тип', sortable: false, value: 'Type.Name' },
                    { text: 'Форма', sortable: false, value: 'EvntType.Name' },
                    { text: 'Состояние', sortable: false, value: 'State.Name' },
                    { text: 'Стадия', sortable: false, value: 'Stage.Name' },
                    { text: 'Причина', sortable: false, value: 'Reason.Name' },
                    { text: 'Заведено', sortable: false, value: 'OccurDate' },
                    { text: 'Полис', value: 'Doc.Client' }
                ],
                paginationPageCurrent: this.pageCurrent,
                paginationPageCount: this.pageCount,
                paginationTotal: this.total,
                paginationPerPage: this.perPage,
                /* pagination: {
                    page: this.pageCurrent,
                    itemsPerPage: (this.items) ? this.items.Length : 0,
                    pageStart: 1,
                    pageStop: this.pageCount,
                    pageCount: this.pageCount,
                    itemsLength: this.total,
                } */
                rowClass: 'test-class',//({item}) => this.getTableItemClass(item)
                itemHref: `${OMInsurance.host}${OMInsurance.path}/Claim/Edit/`,
                addHref: `${OMInsurance.host}${OMInsurance.path}/Claim/Add/`,
            }
        },
        
        computed: {
            getPageCurrent () { return this.pageCurrent },
            getPageCount () { return this.pageCount },
            
        },

        methods: {
            add () {},
            pageMove (i) {            
                this.$emit("pagemove", i);
            },
            getTableItemClass (item) {            
                return 'row-item-class';
            }
        },
    }
</script>