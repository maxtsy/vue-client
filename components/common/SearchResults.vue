<!-- /* Не завершен! */ -->
<template>
    <div class="search-results">
        <v-data-table
            :headers="headers"
            
            :items="searchResults.items"
            :item-class="item => item.Id +''"
            :items-per-page="searchResults.perPage"
            :server-items-length="searchResults.total"                        
            :page="searchResults.pageCurrent"  
            :page-start="1"
            locale="ru"
            @page-count="searchResults.pageCurrent = $event"                        
            hide-default-footer                        
            class="search-results"
            :loading="searchResults.loadingData"
            loading-text="Загрузка... Пожалуйста подождите"
        >
            <!-- <template v-slot:item.Id="{ item }">
                <a :href="itemHref + item.Id" target="_blank" class="text-decoration-none">
                    {{ item.Id }}
                </a>
            </template> -->
            <template v-slot:item.actions="{ item }">
                <v-btn @click.prevent="setAgree(item)" text>
                    Выбрать                            
                </v-btn>
            </template>
        </v-data-table>
        <v-row v-show="searchResults.total > 0">
            <v-col cols="4">
                <v-pagination v-model="searchResults.pageCurrent" :page-start="1" :length="searchResults.pageCount" :total-visible="9" @input="pageMove"></v-pagination>    
            </v-col>
        </v-row>
    </div>    
</template>
<script>
    'use strict'
    export default {
        props: {
            items: Array,
            
        },
        data () {
            return {
                searchResults: {
                    items: [],                
                    total: undefined,                    
                    sizePage: 20,
                    /* curPage: 1,     */                
                    loadingData: false,
                    /* paging begins */
                    pageCurrent: 1,
                    pageCount: undefined,                    
                    pageMove (i) {                                 
                        this.pageCurrent = i        
                    },
                    /* paging ends */
                    clear () {
                        this.items = []                  
                        this.total = undefined
                        this.sizePage = 20
                        /* this.curPage = 1      */                 
                        this.pageCurrent = 1
                        this.pageCount = undefined                    
                    },
                }
            }
        }
    }
</script>