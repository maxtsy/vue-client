<template>
    <div class="search-user">
        <v-dialog 
            v-model="showDialogFlag" 
            persistent 
            max-width="842px">
            <v-card outline>
                <v-card-title>
                    <span class="subtitle-2" style="font-size: 1rem !important;">{{dialogTitle}}</span> 
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="afterClose">close</v-icon>          
                    </v-btn>
                </v-card-title>            
                <v-card-text>
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col cols="2" class="pl-0">
                                    <v-text-field
                                        label="ID"
                                        v-model="form.id"
                                        outlined
                                                
                                        hide-details="auto"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field
                                        label="Логин"
                                        v-model="form.login"
                                        outlined
                                                
                                        hide-details="auto"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="7" class="pr-0">
                                    <v-text-field
                                        label="Фамилия Имя Отчество"
                                        v-model="form.fullname"
                                        outlined
                                                
                                        hide-details="auto"
                                    ></v-text-field>
                                </v-col>                                
                            </v-row>
                            <v-row>
                                <v-col cols="7" class="pl-0">
                                    <v-select 
                                        v-model="form.regionId" 
                                        :items="refsLists.regions" 
                                        label="Регион"
                                        hide-details="auto"
                                        outlined                                
                                    ></v-select> 
                                </v-col>
                                <v-col cols="3">
                                    <v-select 
                                        v-model="form.companyId" 
                                        :items="refsLists.companies" 
                                        label="Компания"
                                        hide-details="auto"
                                        outlined                                
                                    ></v-select>
                                </v-col>
                                <v-col cols="2" class="pr-0">
                                    <v-select 
                                        v-model="form.active" 
                                        :items="refsLists.activities" 
                                        label="Активен"
                                        hide-details="auto"
                                        outlined                                
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" class="pl-0">
                                    <v-btn @click.prevent="search" rounded depressed color="primary">Искать</v-btn><v-btn @click.prevent="clear" rounded depressed color="secondary" class="ml-3">Очистить</v-btn> 
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>

                    <v-data-table
                        :headers="searchResults.headers"                        
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
                            <v-btn @click.prevent="setUser(item)" text>
                                Выбрать                            
                            </v-btn>
                        </template>
                    </v-data-table>
                    <v-row v-show="searchResults.total > 0">
                        <v-col cols="4">
                            <v-pagination v-model="searchResults.pageCurrent" :page-start="1" :length="searchResults.pageCount" :total-visible="7" @input="pageMove"></v-pagination>    
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>            
        </v-dialog>        
    </div>      
</template>

<script>
    'use strict'

    import { requestsMixin } from '@/../mixins/requestsMixin'
    import { apiUserMixin } from '@/../mixins/apiUserMixin'
    import { datesMixin } from '@/../mixins/datesMixin'    
    import { baseRefsMixin } from '@/../mixins/baseRefsMixin'
    import { searchUser } from '@/../entities/searchUser'
    import { searchResults } from '@/../entities/searchResults'

    export default {
        name: 'SearchUser',
        props: {
            dialogTitle: String,
            showDialogFlag: Boolean
        },
        mixins: [ requestsMixin, apiUserMixin, datesMixin, baseRefsMixin ],
        watch: {},
        data () {            
            return {
                currentUser: {
                    id: undefined,
                    regionId: undefined, 
                    companyId: undefined,
                    fullName: undefined,

                    set(data) {
                        this.id = data.Id
                        this.regionId = data.RegionId
                        this.companyId = data.CompanyId
                        this.fullName = data.Fullname
                    }
                },

                form: searchUser,
                searchResults: {
                    headers: [
                        { text: 'ID', align: 'start', sortable: false, value: 'Id', /* divider: true, */ width: 69 },                    
                        { text: 'ФИО', sortable: false, value: 'Fullname' },
                        { text: 'Логин', sortable: false, value: 'Login' },
                        { text: 'Активен', sortable: false, value: 'IsActiveInfo' },
                        { text: '', value: 'actions', sortable: false },                    
                    ],
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
                },  
            }
        },        
        methods: {
            /* возвращает в форму текущего пользователя */
            getCurrentUser () {
                let vm = this

                this.apiGetUserData(OMInsurance.login)
                    .then((response) => {     
                        if (response.result === "OK") {
                            // устанавливаем данные пользователя            
                            vm.currentUser.set(response.data)

                            vm.form.regionId = vm.currentUser.regionId
                            vm.form.companyId = vm.currentUser.companyId
                        }
                        
                    })
            },                     
            /**
             * Обработчик результатов поиска пользователей
             */
            search () {
                var vm = this
                
                this.searchResults.loadingData = true
                const model = this.form.getAspModel()

                model.PageNumber = (this.searchResults.pageCurrent == 0) ? 1 : this.searchResults.pageCurrent 
                model.PageSize = this.searchResults.sizePage                

                this.apiPostUsersSearch(model)
                    .then((response) => {                        
                        if (response.result === "OK") {
                            vm.searchResults.items = JSON.parse(response.items)
                            vm.searchResults.total = response.totalCount
                            vm.searchResults.pageCount = response.pageCount
                            vm.searchResults.pageCurrent = response.pageNumber

                            vm.searchResults.loadingData = false
                        }
                    })
                    .catch((response) => {
                        if (response.status === 401) {
                            alert("Перезагрузите страницу и авторизуйтесь заново!");
                        }
                    })                
            },

            setUser (item) {                
                this.$emit('setdata', { Id: item.Id, Fullname: item.Fullname, Info: item.Id + ' ' + item.Fullname });

                this.afterClose();
            },
            
            // todo: непонятно для чего - наверное нужно убрать
            /* clearSearchResults () {
                var vm = this;                
                vm.searchResults.items = [];
                vm.searchResults.itemsOnPage = [];
                vm.searchResults.total = undefined;
                vm.searchResults.countPage = 1;
                vm.searchResults.sizePage = 20;
                vm.searchResults.curPage = 1;                
            }, */
            /* закрытие окна */
            afterClose () {
                this.$emit('close-dialog')
                this.form.clear()               
            },
            pageMove (i) {     
                this.searchResults.pageMove(i)       
                this.search()

                this.$emit("pagemove", i);
            },
            clear () {                
                this.form.clear();
                this.searchResults.clear();                
            },
        },
        created() {
            this.getCurrentUser()
        },
    }    
</script>