<template>   
    <div class="search-agree">
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="2" class="pl-0">
                        <v-text-field
                            label="ID заявления"
                            v-model="form.id"
                            outlined                                                
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field
                            label="ID застрахованного"
                            v-model="form.clientId"
                            outlined                                                
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-select 
                            v-model="form.stageId" 
                            :items="refsLists.agree.stages" 
                            label="Стадия"
                            hide-details="auto"
                            outlined                                
                        ></v-select> 
                    </v-col>
                    <v-col cols="2">
                        <v-menu
                            ref="tpStartDateMenu"
                            v-model="tpStartDateMenu"
                            :close-on-content-click="false"                                                            
                            transition="scale-transition"
                            offset-y
                            min-width="290px"                                                
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.temporaryPolicyDateFrom"
                                    v-bind="attrs"
                                    @blur="datePickertpStartDate = parseDate(form.temporaryPolicyDateFrom)"
                                    label="Заявление от"
                                    placeholder="__.__.____"                                                
                                    hide-details="auto"                                                                    
                                    outlined                                                
                                    v-on="on"
                                >
                                    <template v-slot:append>
                                        <v-icon small color="#90A4AE" class="mt-1">calendar_today</v-icon>
                                    </template>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="datePickertpStartDate" @input="tpStartDateMenu = false" locale="ru" first-day-of-week="1"  color="primary" no-title scrollable></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="2" class="pr-0">
                        <v-menu
                            ref="tpEndDateMenu"
                            v-model="tpEndDateMenu"
                            :close-on-content-click="false"                                                            
                            transition="scale-transition"
                            offset-y
                            min-width="290px"                                                
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.temporaryPolicyDateTo"
                                    v-bind="attrs"
                                    @blur="datePickerTpEndDate = parseDate(form.temporaryPolicyDateTo)"
                                    label="до"
                                    placeholder="__.__.____"                                                
                                    hide-details="auto"                                                                    
                                    outlined
                                    v-on="on"
                                >
                                    <template v-slot:append>
                                        <v-icon small color="#90A4AE" class="mt-1">calendar_today</v-icon>
                                    </template>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="datePickerTpEndDate" @input="tpEndDateMenu = false" locale="ru" first-day-of-week="1"  color="primary" no-title scrollable></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" class="pl-0">
                        <v-text-field
                            label="Фамилия Имя Отчество"
                            v-model="form.fullName"
                            outlined                                                
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-menu
                            ref="birthDateMenu"
                            v-model="birthDateMenu"
                            :close-on-content-click="false"                                                            
                            transition="scale-transition"
                            offset-y
                            min-width="290px"                                                
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.birthday"
                                    v-bind="attrs"
                                    @blur="datePickerBirthDate = parseDate(form.birthday)"
                                    label="по"
                                    placeholder="__.__.____"                                                
                                    hide-details="auto"                                                                    
                                    outlined                                                
                                    v-on="on"
                                >
                                    <template v-slot:append>
                                        <v-icon small color="#90A4AE" class="mt-1">calendar_today</v-icon>
                                    </template>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="datePickerBirthDate" @input="birthDateMenu = false" locale="ru" first-day-of-week="1" color="primary" no-title scrollable></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field
                            v-model="form.birthdayYearFrom"
                            label="Год от"
                            placeholder="____"
                            outlined                                                
                            hide-details="auto"
                        >
                            <template v-slot:append>
                                <v-icon small color="#90A4AE" class="mt-1">calendar_today</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="2" class="pr-0">
                        <v-text-field
                            v-model="form.birthdayYearTo"
                            label="до"
                            placeholder="____"
                            outlined                                                
                            hide-details="auto"
                        >
                            <template v-slot:append>
                                <v-icon small color="#90A4AE" class="mt-1">calendar_today</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2" class="pl-0">
                        <v-text-field
                            label="СНИЛС"
                            v-model="form.snils"
                            outlined                                                
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field
                            label="ВС"
                            v-model="form.tpn"
                            outlined                                                
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field
                            label="ЕНП"
                            v-model="form.upn"
                            outlined                                                
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field
                            label="Бланк полиса ОМС"
                            v-model="form.blankOms"
                            outlined                                                
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2" class="pr-0">
                        <v-menu
                            ref="omsIssueDateMenu"
                            v-model="omsIssueDateMenu"
                            :close-on-content-click="false"                                                            
                            transition="scale-transition"
                            offset-y
                            min-width="290px"                                                
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.blankOmsIssueDate"
                                    v-bind="attrs"
                                    @blur="datePickerOmsIssueDate = parseDate(form.blankOmsIssueDate)"
                                    label="по"
                                    placeholder="__.__.____"
                                    hide-details="auto"                                                                    
                                    outlined
                                    v-on="on"
                                >
                                    <template v-slot:append>
                                        <v-icon small color="#90A4AE" class="mt-1">calendar_today</v-icon>
                                    </template>
                                </v-text-field>
                            </template>
                            <v-date-picker v-model="datePickerOmsIssueDate" @input="omsIssueDateMenu = false" locale="ru" first-day-of-week="1"  color="primary" no-title scrollable></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="3" class="pl-0">
                        <v-select 
                            v-model="form.scenarioId" 
                            :items="refsLists.agree.scenarios" 
                            label="Тип операции"
                            hide-details="auto"
                            outlined                                
                        ></v-select> 
                    </v-col>
                    <v-col cols="5">
                        <v-select 
                            v-model="form.operatorId" 
                            :items="refsLists.agree.operators" 
                            label="Оператор"
                            hide-details="auto"
                            outlined                                
                        ></v-select> 
                    </v-col>
                    <v-col cols="4" class="pr-0">
                        <v-select 
                            v-model="form.deliveryCenterId" 
                            :items="refsLists.agree.deliveryCenters" 
                            label="Пункт выдачи"
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
    
    import { baseRefsMixin } from '@/../mixins/baseRefsMixin'    
    import { agreeRefsMixin } from '@/../mixins/agreeRefsMixin'
    import { apiUserMixin } from '@/../mixins/apiUserMixin'
    import { apiAgreeMixin } from '@/../mixins/apiAgreeMixin'
    import { datesMixin } from '@/../mixins/datesMixin'    
    import { searchAgree } from '@/../entities/searchAgree'
    import { searchResults } from '@/../entities/searchResults'

    export default {
        name: 'SearchAgree',
        props: {
            showDialogFlag: Boolean
        },
        mixins: [ apiAgreeMixin, apiUserMixin, datesMixin, baseRefsMixin, agreeRefsMixin, searchAgree ],                
        data () {
            return {                
                datePickertpStartDate: new Date().toISOString().substr(0, 10),
                datePickerTpEndDate: new Date().toISOString().substr(0, 10),
                datePickerBirthDate: new Date().toISOString().substr(0, 10),
                datePickerOmsIssueDate: new Date().toISOString().substr(0, 10),

                tpStartDateMenu: false,
                tpEndDateMenu: false,
                birthDateMenu: false,
                omsIssueDateMenu: false,
                
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
                
                form: searchAgree,
                searchResults: {
                    headers: [
                        { text: 'ID', align: 'start', sortable: false, value: 'Id', /* divider: true, */ width: 69 },                    
                        { text: 'ФИО', sortable: false, value: 'Fullname' },
                        { text: 'Пол', sortable: false, value: 'Sex' },
                        { text: 'Дата рождения', sortable: false, value: 'Birthday' },
                        { text: 'Тип операции', sortable: false, value: 'Scenario.Code' },
                        { text: 'ВС', sortable: false, value: 'TemporaryPolicyNumber' },
                        { text: 'ЕНП', sortable: false, value: 'UnifiedPolicyNumber' },
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
        watch: {
            datePickertpStartDate (val) {
                this.form.temporaryPolicyDateFrom = this.formatDate(val)
            },
            datePickerTpEndDate (val) {
                this.form.temporaryPolicyDateTo = this.formatDate(val)
            },
            datePickerBirthDate (val) {
                this.form.birthday = this.formatDate(val)                
            },
            datePickerOmsIssueDate (val) {
                this.form.blankOmsIssueDate = this.formatDate(val)
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
                            vm.currentUser.set(response.data);

                            vm.form.regionId = vm.currentUser.regionId
                            vm.form.companyId = vm.currentUser.companyId
                        }
                        
                    })
            },
            /**
             * Поиск
             */                  
            search () {
                let vm = this

                this.searchResults.loadingData = true

                const model = this.form.getAspModel()

                model.PageNumber = (this.searchResults.pageCurrent == 0) ? 1 : this.searchResults.pageCurrent
                model.PageSize = this.searchResults.sizePage

                this.apiAgreesSearch(model)                
                    .then((response) => {                        
                        if (response.result === "OK") {
                            
                            vm.searchResults.items = JSON.parse(response.items)
                            vm.searchResults.total = response.totalCount
                            vm.searchResults.pageCount = response.pageCount
                            vm.searchResults.pageCurrent = response.pageNumber

                            vm.searchResults.loadingData = false

                        } else {
                            // todo: сообщение об ошибках
                        }
                    })
                    .catch((response) => {
                        if (response.status === 401) {
                            alert("Перезагрузите страницу и авторизуйтесь заново!");
                        }
                    })
            },                       

            setAgree (data) {                
                this.$emit('setdata', { Id: data.Id, Fullname: data.Fullname, TemporaryPolicyNumber: data.TemporaryPolicyNumber, UnifiedPolicyNumber: data.UnifiedPolicyNumber, Info: data.Id + ' ' + data.Fullname });                
                
                this.afterClose()              
            },
            
            /* закрытие окна */
            afterClose () {
                this.$emit('close-dialog');

                this.form.clear();
                this.searchResults.clear();
            },
            clear () {                
                this.form.clear();
                this.searchResults.clear();                
            }, 
            pageMove(i) {
                this.searchResults.pageMove(i)
                this.search()

                this.$emit("pagemove", i);
            } 
        },
        created() {
            this.getCurrentUser()
        },          
    }    
</script>