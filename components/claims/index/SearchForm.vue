<template>
    <v-card outlined>
        <v-expansion-panels flat v-model="expansionPanels.searchForm">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default>
                        <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                        <div style="color:#455A64;">ПОИСК</div>
                    </template>
                    <template v-slot:actions>&nbsp;</template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col cols="2">
                                    <v-text-field
                                        v-model="searchClaim.id"                
                                        label="ID" 
                                        outlined   
                                                                                                                                                        
                                        hide-details="auto"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field
                                        v-model="searchClaim.upn"
                                        label="ЕНП"
                                        outlined
                                                
                                        hide-details="auto"                                                                                          
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="2">
                                    <v-text-field
                                        v-model="searchClaim.tpn"
                                        label="ВС"
                                        outlined
                                             
                                        hide-details="auto"                                     
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="5">
                                    <v-text-field
                                        label="Заявитель"
                                        v-model="searchClaim.member.fullName"
                                        outlined
                                               
                                        hide-details="auto"                                                 
                                    ></v-text-field>
                                </v-col>                                                                                        
                            </v-row>
                            <v-row>
                                <v-col cols="3">
                                    <v-select 
                                        v-model="searchClaim.regionId" 
                                        :items="refsLists.regions" 
                                        label="Регион"
                                        hide-details="auto"
                                        outlined
                                        
                                    ></v-select> 
                                </v-col>                                        
                                <v-col cols="3">
                                    <v-select 
                                        v-model="searchClaim.companyId" 
                                        :items="refsLists.companies" 
                                        label="Компания"
                                        hide-details="auto"
                                        outlined        
                                                                           
                                    ></v-select>
                                </v-col>                                                                                                            
                                <v-col cols="2">
                                    <v-select 
                                        v-model="searchClaim.stateId" 
                                        :items="refsLists.claimStates" 
                                        label="Состояние"
                                        hide-details="auto"
                                        outlined
                                                                             
                                    ></v-select> 
                                </v-col>
                                <v-col cols="4">
                                    <v-select 
                                        v-model="searchClaim.stageId" 
                                        :items="refsLists.claimStages" 
                                        label="Стадия"
                                        hide-details="auto"
                                        outlined
                                                                                  
                                    ></v-select> 
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="2">
                                    <v-select 
                                        v-model="searchClaim.eventTypeId" 
                                        :items="refsLists.eventForms" 
                                        label="Форма"
                                        hide-details="auto"
                                        outlined
                                                                                   
                                    ></v-select>
                                </v-col>
                                <v-col cols="2">
                                    <v-select 
                                        v-model="searchClaim.recipTypeId" 
                                        :items="refsLists.claimReciptTypes" 
                                        label="Источник"
                                        hide-details="auto"
                                        outlined
                                                                                
                                    ></v-select> 
                                </v-col>
                                <v-col cols="3">
                                    <v-select 
                                        v-model="searchClaim.typeId" 
                                        :items="refsLists.claimTypes" 
                                        label="Тип обращения"
                                        hide-details="auto"
                                        outlined
                                                                                  
                                    ></v-select> 
                                </v-col>
                                <v-col cols="5">
                                    <v-select 
                                        v-model="searchClaim.reasonId" 
                                        :items="refsLists.claimReasons" 
                                        label="Причина"
                                        hide-details="auto"
                                        outlined
                                                                           
                                    ></v-select> 
                                </v-col>                                                    
                            </v-row>                                                
                            <v-row>
                                <v-col cols="2">
                                    <v-menu
                                        ref="startDateMenu"
                                        v-model="startDateMenu"
                                        :close-on-content-click="false"                                                            
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                        max-width="290px"                                              
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="searchClaim.startDate"
                                                v-bind="attrs"
                                                @blur="datePickerStartDate = parseDate(searchClaim.startDate)"
                                                label="с"
                                                placeholder="__.__.____"
                                                append-icon="event"
                                                hide-details="auto"                                                                    
                                                outlined
                                                                                                             
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="datePickerStartDate" @input="startDateMenu = false" locale="ru" first-day-of-week="1" color="primary"  no-title scrollable></v-date-picker>                                                            
                                    </v-menu>                                                        
                                </v-col>
                                <v-col cols="2">
                                    <v-menu
                                        ref="endDateMenu"
                                        v-model="endDateMenu"
                                        :close-on-content-click="false"                                                            
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"                                                
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="searchClaim.endDate"
                                                v-bind="attrs"
                                                @blur="datePickerEndDate = parseDate(searchClaim.endDate)"
                                                label="по"
                                                placeholder="__.__.____"
                                                append-icon="event"
                                                hide-details="auto"                                                                    
                                                outlined
                                                
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="datePickerEndDate" @input="endDateMenu = false" locale="ru" first-day-of-week="1"  color="primary" no-title scrollable></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="5">
                                    <v-text-field
                                        :disabled="searchOnlyMyClaims"
                                        label="Пользователь"
                                        v-model="searchClaim.user.fullName"
                                        hide-details="auto"
                                        outlined
                                                                                                                                                        
                                    ></v-text-field>
                                </v-col> 
                                <v-col cols="3">
                                    <v-switch v-model="searchOnlyMyClaims" inset dense label="Показывать только мои" style="margin-top:3px"></v-switch>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="2">
                                    <v-btn rounded depressed type="button" color="primary" @click="apiSearchClaims">
                                        <v-icon size="16">search</v-icon> Искать
                                    </v-btn>
                                </v-col>
                                <v-col cols="2"></v-col>
                            </v-row>
                        </v-container>
                    </v-form> 
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>                                                      
    </v-card>    
</template>

<script>
//TODO: дефолтный поиск осуществляется раньше чем получаем пользователя и получаем неверный результат поиска 
// TODO: Разобраться с filterReasons методом
// TODO: Переписать apiGetUserData, сохранять данные через then catch 
    "use strict";
    //mixins
    import { requestsMixin } from '../../../mixins/requestsMixin'
    import { apiUserMixin } from '../../../mixins/apiUserMixin'
    import { datesMixin } from '@/../mixins/datesMixin'
    import { baseRefsMixin } from '@/../mixins/baseRefsMixin'
    import { claimRefsMixin } from '@/../mixins/claimRefsMixin'
    import { searchClaim } from '@/../entities/searchClaim'

    export default {
        name: "SearchForm",
        mixins: [ requestsMixin, apiUserMixin, baseRefsMixin, claimRefsMixin, datesMixin ],
        
        props: {
            pageCurrent: Number
        },

        data () { 
            return {                                    
                /* активные панели на странице */
                expansionPanels: {
                    searchForm: 0                
                },
                
                /* датапикеры */
                datePickerStartDate: new Date().toISOString().substr(0, 10),
                datePickerEndDate: new Date().toISOString().substr(0, 10),            

                startDateMenu: false,
                endDateMenu: false,

                currentUser: { 
                    id: undefined, 
                    fullName: undefined,
                    regionId: undefined,
                    companyId: undefined
                },                                                                       

                searchClaim: searchClaim,            
                
                searchResults: {
                    claims: [],                
                    total: undefined,
                    sizePage: 20,
                    curPage: 1,                
                    loadingData: false,                
                },   
                
                searchOnlyMyClaims: true
            }
        },

        watch: {
            datePickerStartDate (val) {            
                this.searchClaim.startDate = this.formatDate(val)
            },
            datePickerEndDate (val) {            
                this.searchClaim.endDate = this.formatDate(val)
            },
            searchOnlyMyClaims: {
                immediate: true,
                deep: false,
                handler (nVal, oVal) {
                    if (nVal) {
                        this.searchClaim.user.set(this.currentUser);
                    } else {
                        this.searchClaim.user.clear();
                    }
                }            
            },
            pageCurrent: {
                immediate: true,
                deep: false,
                handler (nVal, oVal) {
                    this.apiSearchClaims();
                }            
            }
        },

        methods: {        

            
            /**
             * Фильтр Причин 
             */
            filterReasons: function () {
                var vm = this,
                    typeId = vm.searchClaim.typeId;

                vm.searchClaim.reasons = vm.refs.claimReasons.filter(function (item) { return item.TypeId === typeId });
            },
                    
            //Пока что нет кнопки        
            clear () {},        
            
            /**
             * Отсылает модель поиска на сервер и получаем список претензий
             */
            async apiSearchClaims () {
                let vm = this;
                
                this.$emit("loadingdata", true);

                let searchCriteria = this.searchClaim.getAspModel();
                searchCriteria.PageSize = this.searchResults.sizePage;
                searchCriteria.PageNumber = this.pageCurrent;

                const { data } = await this.postClaimsSearch(JSON.stringify(searchCriteria));                                      
                
                if (data.result === "OK") {

                    vm.searchResults.claims = JSON.parse(data.items);                

                    vm.searchResults.total = data.totalCount;
                    vm.searchResults.countPage = data.pageCount;                                                           
                    
                    this.$emit("search-ends", vm.searchResults);
                    
                    this.$emit("loadingdata", false);
                } else {                        
                    // добавить сообщение об ошибке
                }
            },
            /**
             * Возвращает данные пользователя: Id и FullName
             */
            setCurrentUser () {
                let vm = this

                this.apiGetUserData(OMInsurance.login)
                    .then((response) => {     
                        if (response.result === "OK") {
                            // устанавливаем данные пользователя            
                            vm.currentUser.id = response.data.Id
                            vm.currentUser.fullName = response.data.FullName
                            vm.currentUser.regionId = response.data.RegionId
                            vm.currentUser.companyId = response.data.CompanyId

                            // устанавливаем данные пользователя            
                            vm.searchClaim.user.set(vm.currentUser)
                            // устанавливаем регион + компания  
                            vm.searchClaim.setBaseData(vm.currentUser)
                        }
                        
                    })
                    .catch((response) => {
                        // todo: сообщение об авторизации 401
                    })
            },                    
        },
        created () {   
            this.setCurrentUser()               

            this.filterReasons()
        }
    }
</script>