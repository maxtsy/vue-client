<template>
    <div class="event-member-form">
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="4" class="pl-0">
                        <v-select 
                            v-model="form.typeId" 
                            :items="refsLists.memberTypes" 
                            label="Тип"
                            hide-details="auto"
                            outlined                                
                        ></v-select> 
                    </v-col>
                    <v-col cols="3">
                        <v-text-field
                            label="ID"
                            v-model="form.client.id"
                            outlined                                    
                            hide-details="auto"                                                 
                        >
                            <template v-slot:append>
                                <v-icon @click="flags.searchClientDialogVisible = true" small color="secondary" class="mt-1">search</v-icon>                                
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="9" class="pl-0">
                        <v-text-field
                            label="Фамилия Имя Отчество"
                            v-model="form.client.fullname"
                            outlined
                                    
                            hide-details="auto"                                                 
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3" class="pr-0">
                        <v-menu
                            ref="clientBirthDateMenu"
                            v-model="clientBirthDateMenu"
                            :close-on-content-click="false"                                                            
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                            max-width="290px"                                              
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="form.client.birthDate"
                                    v-bind="attrs"
                                    @blur="datePickerClientBirthDate = parseDate(form.client.birthDate)"
                                    label="Дата рождения"
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
                            <v-date-picker v-model="datePickerClientBirthDate" @input="clientBirthDateMenu = false" locale="ru" first-day-of-week="1" color="primary" no-title scrollable></v-date-picker>                                                            
                        </v-menu>                                                        
                    </v-col>                        
                </v-row>
                <v-row>
                    <v-col cols="6" class="pl-0">
                        <v-text-field
                            label="Адрес"
                            v-model="form.client.address"
                            outlined
                                    
                            hide-details="auto"                                                 
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field
                            label="Телефон"
                            v-model="form.client.phone"
                            outlined
                                    
                            hide-details="auto"                                                 
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3" class="pr-0">
                        <v-text-field
                            label="Email"
                            v-model="form.client.email"
                            outlined
                                    
                            hide-details="auto"                                                 
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="pl-0 pr-0">
                        <v-textarea
                            v-model="form.note"
                            rows="2"
                            outlined                                    
                            label="Примечание"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="pl-0">
                        <v-btn @click.prevent="postEventMember" rounded depressed color="primary">
                            Добавить                            
                        </v-btn>  
                    </v-col>
                </v-row>
            </v-container>
        </v-form>

        <search-client 
            dialog-title="Поиск застрахованного" 
            :show-dialog-flag="flags.searchClientDialogVisible" 
            @close-dialog="flags.searchClientDialogVisible = false" 
            @setdata="setClientFromClientSearch"></search-client>
    </div>
</template>

<script>
    'use strict'

    import { apiEventMembersMixin } from '@/../mixins/apiEventMembersMixin'    
    import { apiUserMixin } from '@/../mixins/apiUserMixin'    
    import { claimRefsMixin } from '@/../mixins/claimRefsMixin'
    
    import { editEventMember } from '@/../entities/editEventMember'
    import { EventMember } from "@/../classes/EventMember"

    import { mask } from "vue-the-mask"

    import SearchClient from "@/../components/common/SearchClient"

    export default {
        name: "EventMemberForm",
        props: { 
            clmId: Number,
            memberId: Number,
            showDialogFlag: Boolean
        },    
        components: { SearchClient },
        directives: { mask },
        mixins: [ apiEventMembersMixin, apiUserMixin, claimRefsMixin ],
        /* следим */
        watch: {
            /* закрытие формы */        
            showDialogFlag: {
                immediate: true,
                deep: false,
                handler(val) {      
                    if (!val)                
                        this.form.clear();

                    if (val && this.memberId) {
                        this.apiGetClaimMember(this.memberId)
                            .then((response) => {
                                if (response.result === "Ok") {
                                    this.form.setFromMember(JSON.parse(response.data.member))
                                } else {
                                    // todo: сообщение об ошибке
                                }
                            })
                            .catch((response) => {
                                if (response.status === 401) {
                                    alert("Перезагрузите страницу и авторизуйтесь заново!");
                                }
                            })
                    }
                        
                }
            }
        },    
        
        data () {            
            return {  
                datePickerClientBirthDate: new Date().toISOString().substr(0, 10),
                clientBirthDateMenu: false,

                flags: {
                    searchClientDialogVisible: false
                },
                
                member: undefined,

                form: editEventMember
            }
        },
        methods: {   
            /**
             * Сохранение / обновление участника с поднятием события
             */
            postEventMember () {                
                if (this.form.id) {
                    this.apiPostUpdClaimMember(this.form.getAspModel())
                        .then((response) => {
                            if (response.result == "Ok") {
                                this.$emit("setdata", response.result)
                                this.$emit('close-dialog')
                            } else {
                                // todo: сообщение об ошибке
                            }
                        })
                } else {
                    this.apiPostSetClaimMember(this.form.getAspModel())
                        .then((response) => {
                            if (response.result == "Ok") {
                                this.$emit("setdata", response.result)
                                this.$emit('close-dialog')
                            } else {
                                // todo: сообщение об ошибке
                            }
                                
                        })
                }
            },
            
            setClientFromClientSearch (data) {                
                if (data) {                          
                    /*очищаем*/
                    this.form.clearMember();
                    /*устанавливаем*/
                    if (data.Id) {
                        this.apiGetClientData(data.Id)
                            .then((response) => {                                 
                                if (response.result == "Ok") {
                                    let data = JSON.parse(response.data.client)

                                    data.ClaimId = this.clmId
                                    data.UserId = 1

                                    this.form.setFromClient(data)
                                } else {
                                    // todo: сообщение об ошибке
                                }
                            })
                            .catch((response) => {
                                // todo: сообщение об ошибке авторизации
                            })
                    }                
                }
            },        
        },        
    }
</script>