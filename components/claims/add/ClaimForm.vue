<template>
    <div class="claim-form">
        <v-row no-gutters>
            <v-col cols="12" class="px-3">
                <v-row no-gutters class="py-3">
                    <v-col cols="7"><h1 class="text-h6 blue-grey--text text--darken-2 font-weight-medium" style="font-size:18px;">Обращения / Новое обращение</h1></v-col>
                    <v-col cols="5" class="text-right"></v-col>                            
                </v-row>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="8" class="px-3">
                <v-row no-gutters class="py-3">
                    <v-col cols="12">
                        <v-form>
                            <v-card outlined>
                                <v-expansion-panels flat v-model="expansionPanels.common">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            <template v-slot:default>
                                                <div class="text-uppercase font-weight-medium blue-grey--text text--darken-2 order-1">Общая информация</div>
                                                <div class="v-expansion-panel-header__icon order-0" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light blue-grey--text text--darken-2" style="font-size:12px;">keyboard_arrow_down</i></div>
                                            </template>
                                            <template v-slot:actions>&nbsp;</template>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <!-- <v-container> -->

                                                <v-row class="mx-0">
                                                    <v-col cols="3">
                                                        <v-select 
                                                            v-model="form.companyId" 
                                                            :items="refsLists.companies" 
                                                            label="Компания"
                                                            hide-details="auto"
                                                            outlined
                                                            
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-select 
                                                            v-model="form.regionId" 
                                                            :items="refsLists.regions" 
                                                            label="Регион"
                                                            hide-details="auto"
                                                            outlined
                                                            
                                                        ></v-select> 
                                                    </v-col>                                                                                                        
                                                </v-row>

                                                <v-row class="mx-0">
                                                    <v-col cols="2" class="pl-0">
                                                        <v-select 
                                                            v-model="form.eventId" 
                                                            :items="refsLists.eventForms" 
                                                            label="Форма"
                                                            hide-details="auto"
                                                            outlined
                                                                                                    
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="2">
                                                        <v-select 
                                                            v-model="form.reciptTypeId" 
                                                            :items="refsLists.claimReciptTypes" 
                                                            label="Источник"
                                                            hide-details="auto"
                                                            outlined
                                                                                                    
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-select 
                                                            v-model="form.typeId"                                                            
                                                            :items="refsLists.claimTypes" 
                                                            label="Тип обращения"
                                                            hide-details="auto"
                                                            outlined
                                                                                                    
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="5" class="pr-0">
                                                        <claim-reasons-dialog 
                                                            @reason-selected="afterReasonSelected" 
                                                            :claim-type-id="form.typeId"
                                                            :claim-reason-id="form.reasonId"
                                                            :claim-reasons="refsLists.claimReasons"
                                                            :refs-claim-reasons="refs.claimReasons"
                                                        ></claim-reasons-dialog>
                                                        <!-- <v-select 
                                                            v-model="form.reasonId" 
                                                            :items="filtredClaimReasons" 
                                                            label="Причина"
                                                            hide-details="auto"
                                                            outlined
                                                                                            
                                                        ></v-select> -->
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mx-0">
                                                    <v-col cols="12" class="px-0">
                                                        <v-btn @click="flags.qaDialog = true" text color="primary">Стандартные вопросы и ответы</v-btn>
                                                        <v-tabs>
                                                            <v-tab>Вопрос</v-tab>
                                                            <v-tab>Ответ</v-tab>
                                                            <v-tab>Заметка</v-tab>
                                                            <v-tab-item>
                                                                <v-textarea
                                                                    v-model="form.question"
                                                                    rows="3"
                                                                    outlined                                    
                                                                    label="Вопрос"
                                                                ></v-textarea>
                                                            </v-tab-item>
                                                            <v-tab-item>
                                                                <v-textarea
                                                                    v-model="form.answer"
                                                                    rows="3"
                                                                    outlined                                    
                                                                    label="Ответ"
                                                                ></v-textarea>
                                                            </v-tab-item>
                                                            <v-tab-item>
                                                                <v-textarea
                                                                    v-model="form.note"
                                                                    rows="3"
                                                                    outlined                                    
                                                                    label="Заметка"
                                                                ></v-textarea>
                                                            </v-tab-item>
                                                        </v-tabs>
                                                    </v-col>
                                                </v-row>                                                
                                            <!-- </v-container> -->
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card>

                            <v-card outlined class="mt-6">
                                <v-expansion-panels flat v-model="expansionPanels.policy">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            <template v-slot:default>
                                                <div class="text-uppercase font-weight-medium blue-grey--text text--darken-2 order-1">Информация о полисе</div>
                                                <div class="v-expansion-panel-header__icon order-0" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light blue-grey--text text--darken-2" style="font-size:12px;">keyboard_arrow_down</i></div>
                                            </template>
                                            <template v-slot:actions>&nbsp;</template>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-row class="mx-0">
                                                <v-col cols="5" class="pl-0">                                                    
                                                    <v-text-field
                                                        label="Полис"
                                                        v-model="form.policyInfo"
                                                        outlined                         
                                                        hide-details="auto"
                                                    >
                                                            <template v-slot:append>
                                                                <v-icon @click="flags.searchAgreeDialogVisible = true" small color="secondary" class="mt-1">search</v-icon>                                
                                                            </template>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field
                                                        v-model="form.tpn"
                                                        label="ВС"
                                                        outlined                                                                
                                                        hide-details="auto"                                     
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field
                                                        v-model="form.enp"
                                                        v-mask="'#### #### #### ####'"
                                                        label="ЕНП"
                                                        outlined
                                                        type="text"
                                                        hide-details="auto"                                                                                          
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card>

                            <v-card outlined class="mt-6">
                                <v-expansion-panels flat v-model="expansionPanels.members">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            <template v-slot:default>
                                                <div class="text-uppercase font-weight-medium blue-grey--text text--darken-2 order-1">Информация об участнике</div>
                                                <div class="v-expansion-panel-header__icon order-0" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light blue-grey--text text--darken-2" style="font-size:12px;">keyboard_arrow_down</i></div>
                                            </template>
                                            <template v-slot:actions>&nbsp;</template>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <!-- Застрахованный -->
                                            <v-row class="mx-0">
                                                <v-col cols="12" class="pb-0">
                                                    <span class="subtitle-2" style="font-size: 1rem !important;">Застрахованный</span>
                                                </v-col>
                                            </v-row>
                                            <v-row class="mx-0">
                                                <v-col cols="12">
                                                    <v-switch 
                                                        v-model="form.client.isApplicant" 
                                                        @change.native.stop="form.applicant.copyFromClient(form.client)" 
                                                        :disabled="!form.client.clientId"
                                                        inset dense label="Является заявителем" style="margin-top:3px"
                                                    ></v-switch>
                                                </v-col>
                                            </v-row>
                                            <v-row class="mx-0">
                                                <v-col cols="2">
                                                    <v-text-field
                                                        label="ID"
                                                        v-model="form.client.clientId"
                                                        outlined                                    
                                                        hide-details="auto"                                                 
                                                        >
                                                            <template v-slot:append>
                                                                <v-icon @click="flags.searchClientDialogVisible = true" small color="secondary" class="mt-1">search</v-icon>                                
                                                            </template>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field
                                                        label="Фамилия Имя Отчество"
                                                        v-model="form.client.fullname"
                                                        outlined
                                                            
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-menu
                                                            ref="birthDateMenu"
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
                                                                    @blur="dateTimePickerClientBirthDate = parseDate(form.client.birthDate)"
                                                                    label="Дата"
                                                                    placeholder="__.__.____"
                                                                    append-icon="event"
                                                                    hide-details="auto"                                                                    
                                                                    outlined
                                                                                                                                
                                                                    v-on="on"
                                                                >
                                                                    <template v-slot:append>
                                                                        <v-icon small color="secondary" class="mt-1">schedule</v-icon>
                                                                    </template>
                                                                </v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="dateTimePickerClientBirthDate" @input="clientBirthDateMenu = false" locale="ru" first-day-of-week="1" color="primary"  no-title scrollable></v-date-picker>                                                            
                                                        </v-menu>
                                                </v-col>
                                            </v-row>
                                            <v-row class="mx-0">
                                                <v-col cols="5">
                                                    <v-text-field
                                                        label="Адрес"
                                                        v-model="form.client.address"
                                                        outlined
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field
                                                        label="Моб. телефон"
                                                        v-model="form.client.phoneM"
                                                        outlined
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field
                                                        label="Email"
                                                        v-model="form.client.email"
                                                        outlined
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            
                                            <!-- Представитель -->
                                            <v-row class="mx-0">
                                                <v-col cols="12" class="pb-0">
                                                    <span class="subtitle-2" style="font-size: 1rem !important;">Представитель</span>
                                                </v-col>
                                            </v-row>
                                            <v-row class="mx-0">
                                                <v-col cols="12">
                                                    <v-switch 
                                                        v-model="form.representative.isApplicant" 
                                                        @change.native.stop="form.applicant.copyFromRepresentative(form.representative)" 
                                                        :disabled="!form.representative.clientId" 
                                                        inset dense label="Является заявителем" style="margin-top:3px"
                                                    ></v-switch>
                                                </v-col>
                                            </v-row>
                                            <v-row class="mx-0">
                                                <v-col cols="2">
                                                    <v-text-field
                                                        label="ID"
                                                        v-model="form.representative.clientId"
                                                        outlined                                    
                                                        hide-details="auto"                                                 
                                                        >
                                                            <template v-slot:append>
                                                                <v-icon @click="flags.searchRepresentativeDialogVisible = true" small color="secondary" class="mt-1">search</v-icon>                                
                                                            </template>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field
                                                        label="Фамилия Имя Отчество"
                                                        v-model="form.representative.fullname"
                                                        outlined
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-menu
                                                            ref="representativeBirthDateMenu"
                                                            v-model="representativeBirthDateMenu"
                                                            :close-on-content-click="false"                                                            
                                                            transition="scale-transition"
                                                            offset-y
                                                            min-width="290px"
                                                            max-width="290px"                                              
                                                        >
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="form.representative.birthDate"
                                                                    v-bind="attrs"
                                                                    @blur="dateTimePickerRepresentativeBirthDate = parseDate(form.representative.birthDate)"
                                                                    label="Дата"
                                                                    placeholder="__.__.____"
                                                                    append-icon="event"
                                                                    hide-details="auto"                                                                    
                                                                    outlined
                                                                                                                                
                                                                    v-on="on"
                                                                >
                                                                    <template v-slot:append>
                                                                        <v-icon small color="secondary" class="mt-1">schedule</v-icon>
                                                                    </template>
                                                                </v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="dateTimePickerRepresentativeBirthDate" @input="representativeBirthDateMenu = false" locale="ru" first-day-of-week="1" color="primary"  no-title scrollable></v-date-picker>                                                            
                                                        </v-menu>
                                                </v-col>
                                            </v-row>
                                            <v-row class="mx-0">
                                                <v-col cols="5">
                                                    <v-text-field
                                                        label="Адрес"
                                                        v-model="form.representative.address"
                                                        outlined
                                                            
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field
                                                        label="Моб. телефон"
                                                        v-model="form.representative.phoneM"
                                                        outlined
                                                            
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field
                                                        label="Email"
                                                        v-model="form.representative.email"
                                                        outlined
                                                            
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <!-- Заявитель -->
                                            <v-row class="mx-0">
                                                <v-col cols="12" class="pb-0">
                                                    <span class="subtitle-2" style="font-size: 1rem !important;">Заявитель</span>
                                                </v-col>
                                            </v-row>                                            
                                            <v-row class="mx-0">
                                                <v-col cols="2">
                                                    <v-text-field
                                                        label="ID"
                                                        v-model="form.applicant.clientId"
                                                        outlined                                    
                                                        hide-details="auto"                                                 
                                                        >
                                                            <template v-slot:append>
                                                                <v-icon @click="flags.searchApplicantDialogVisible = true" small color="secondary" class="mt-1">search</v-icon>                                
                                                            </template>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field
                                                        label="Фамилия Имя Отчество"
                                                        v-model="form.applicant.fullname"
                                                        outlined
                                                            
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-menu
                                                            ref="applicantBirthDateMenu"
                                                            v-model="applicantBirthDateMenu"
                                                            :close-on-content-click="false"                                                            
                                                            transition="scale-transition"
                                                            offset-y
                                                            min-width="290px"
                                                            max-width="290px"                                              
                                                        >
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="form.applicant.birthDate"
                                                                    v-bind="attrs"
                                                                    @blur="dateTimePickerApplicantBirthDate = parseDate(form.applicant.birthDate)"
                                                                    label="Дата"
                                                                    placeholder="__.__.____"
                                                                    append-icon="event"
                                                                    hide-details="auto"                                                                    
                                                                    outlined
                                                                                                                                
                                                                    v-on="on"
                                                                >
                                                                    <template v-slot:append>
                                                                        <v-icon small color="secondary" class="mt-1">schedule</v-icon>
                                                                    </template>
                                                                </v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="dateTimePickerApplicantBirthDate" @input="applicantBirthDateMenu = false" locale="ru" first-day-of-week="1" color="primary"  no-title scrollable></v-date-picker>                                                            
                                                        </v-menu>
                                                </v-col>
                                            </v-row>
                                            <v-row class="mx-0">
                                                <v-col cols="5">
                                                    <v-text-field
                                                        label="Адрес"
                                                        v-model="form.applicant.address"
                                                        outlined
                                                            
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field
                                                        label="Моб. телефон"
                                                        v-model="form.applicant.phoneM"
                                                        outlined
                                                            
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                                <v-col cols="3">
                                                    <v-text-field
                                                        label="Email"
                                                        v-model="form.applicant.email"
                                                        outlined
                                                            
                                                        hide-details="auto"                                                 
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card>
                        </v-form>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="4" class="px-3">
                <v-row no-gutters class="py-3">
                    <v-col cols="12">                        
                        <v-row no-gutters>
                            <v-col cols="12" class="py-4">
                                <v-btn @click.stop="save" depressed class="white" color="secondary">
                                    <template v-slot:default>
                                        <v-icon small class="mr-1">save</v-icon>Сохранить изменения                                        
                                    </template>                            
                                </v-btn>
                            </v-col>
                        </v-row>                        
                    </v-col>                
                </v-row>
            </v-col>
        </v-row>

        <v-dialog 
            v-model="flags.qaDialog" 
            persistent 
            max-width="700px">
            <v-card>
                <v-card-title>
                    <span class="subtitle-2" style="font-size: 1rem !important;">Стандартные вопросы и ответы</span> 
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="flags.qaDialog = false">close</v-icon>          
                    </v-btn>
                </v-card-title>            
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                label="Поиск"
                                v-model="searchQA"
                                outlined
                                hide-details="auto"                                                 
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-data-table
                                @item-selected="selectQA"
                                :headers="headers"
                                :items="refs.qas"
                                :single-expand="true"
                                :single-select="true"
                                :expanded.sync="expanded"
                                :search="searchQA"
                                :disable-pagination="true"
                                :hide-default-header="true"
                                :hide-default-footer="true"
                                :items-per-page="refs.qas.length"
                                item-key="Question"
                                show-expand
                                show-select
                                dense
                            >                                
                                <template v-slot:expanded-item="{ headers, item }">
                                    <td :colspan="headers.length" class="py-2">{{ item.Answer }}</td>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="pl-0">
                            <v-btn @click.stop="selectQA" rounded depressed color="primary">Использовать</v-btn>  
                        </v-col>
                    </v-row>
                </v-card-text>                
            </v-card>
        </v-dialog>

        <search-agree-dialog 
            :show-dialog-flag="flags.searchAgreeDialogVisible" 
            @close-dialog="flags.searchAgreeDialogVisible = false" 
            @setdata="setAgreeFromAgreeSearch" 
            dialog-title="Поиск полиса"
        ></search-agree-dialog>

        <search-client 
            dialog-title="Поиск застрахованного" 
            :show-dialog-flag="flags.searchClientDialogVisible" 
            @close-dialog="flags.searchClientDialogVisible = false" 
            @setdata="setClientFromClientSearch"></search-client>
        <search-client 
            dialog-title="Поиск застрахованного" 
            :show-dialog-flag="flags.searchRepresentativeDialogVisible" 
            @close-dialog="flags.searchRepresentativeDialogVisible = false" 
            @setdata="setRepresentativeFromClientSearch"></search-client>
        <search-client 
            dialog-title="Поиск застрахованного" 
            :show-dialog-flag="flags.searchApplicantDialogVisible" 
            @close-dialog="flags.searchApplicantDialogVisible = false" 
            @setdata="setApplicantFromClientSearch"></search-client>

    </div>
</template>
<script>
// todo Закончить поиск по таблице ВО
// todo Закончить выбор в таблице ВО

// todo Дата создания должна быть sysdate
// todo Удалить поля phone у членов

    'use strict'
    /* миксины */
    import { requestsMixin } from '@/../mixins/requestsMixin'
    import { apiClaimMixin } from '@/../mixins/apiClaimMixin'
    import { apiUserMixin } from '@/../mixins/apiUserMixin'
    import { apiAgreeMixin } from '@/../mixins/apiAgreeMixin'
    import { datesMixin } from '@/../mixins/datesMixin'
    import { baseRefsMixin } from '@/../mixins/baseRefsMixin'
    import { claimRefsMixin } from '@/../mixins/claimRefsMixin'
    /* объекты */
    import { createClaim } from '@/../entities/createClaim'
    /* компоненты */
    import SearchAgreeDialog from "@/../components/common/SearchAgreeDialog"
    import SearchClient from "@/../components/common/SearchClient"
    import ClaimReasonsDialog from "@/../components/claims/common/ClaimReasonsDialog"
    /* маска для полей */
    import { mask } from 'vue-the-mask'

    export default {
        name: 'ClaimForm',
        mixins: [ requestsMixin, apiClaimMixin, apiUserMixin, apiAgreeMixin, datesMixin, baseRefsMixin, claimRefsMixin ],
        components: { SearchAgreeDialog, SearchClient, ClaimReasonsDialog },
        directives: { mask },
        watch: {
            dateTimePickerBirthDate (val) {
                this.form.client.birthDate = this.formatDate(val)
            },
            currentUser: {
                immediate: true,
                deep: true,
                handler (val) {
                    let vm = this
                    this.apiGetQARefs(val.regionId, this.form.reasonId)
                        .then((response) => {
                            if (response.result == 'OK') {
                                let qas = JSON.parse(response.qa);

                                qas.sort(function (item1, item2) {
                                    var val1 = parseInt(item1.Question.split(". ", 1)),
                                        val2 = parseInt(item2.Question.split(". ", 1));

                                    if (val1 == val2) return 0;
                                    if (val1 > val2) return 1;
                                    if (val1 < val2) return -1;
                                });      
                            
                                vm.refs.qas = qas                                                   
                            }
                        })
                        .catch((response) => {
                            // todo: сообщение об ошибке авторизации
                        })
                }                
            }
        },
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

                expansionPanels: {
                    common: 0,
                    policy: 0,
                    members: 0
                },
                flags: {
                    searchAgreeDialogVisible: false,
                    searchClientDialogVisible: false,
                    searchRepresentativeDialogVisible: false,
                    searchApplicantDialogVisible: false,
                    qaDialog: false,
                    listClaimReasonsDialog: false
                },
                refs: {
                    qas: []
                },
                form: createClaim,

                /* датапикеры */
                dateTimePickerClientBirthDate: new Date().toISOString(),
                dateTimePickerRepresentativeBirthDate: new Date().toISOString(),
                dateTimePickerApplicantBirthDate: new Date().toISOString(),
                clientBirthDateMenu: false,
                representativeBirthDateMenu: false,
                applicantBirthDateMenu: false,

                /* Выбранные вопрос и ответ */
                selectedQuestion: '',
                selectedAnswer: '',

                headers: [
                    { text: '', value: 'Question', sortable: false },
                    { text: '', value: 'data-table-expand' },
                ],

                searchQA: '',
                expanded: []
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

            save () {
                let model = this.form.getAspModel()

                this.apiSetClaim(model)
                    .then((response) => {
                        if (response.result == 'Ok') {
                            // todo: чистим форму и пишем сообщение
                            this.form.clear()
                        } else {
                            // todo: сообщение об ошибке
                        }
                    })
                    .catch((response) => {
                        // todo: сообщение об ошибке
                    })
            },
            setAgreeFromAgreeSearch (data) {
                console.log(data)
                let vm = this

                if (data) {
                    this.apiGetAgree(data.Id)
                        .then((response) => {
                            var r = JSON.parse(response.item)

                            vm.form.agreeId = data.Id
                            vm.form.fullname = data.Fullname
                            vm.form.policyInfo = data.Info
                            vm.form.enp = data.UnifiedPolicyNumber;
                            vm.form.tpn = data.TemporaryPolicyNumber;

                            vm.form.client.set(r)
                            vm.form.representative.set(r)

                        })
                        .catch((response) => {
                            // todo сообщение об ошибке
                        })
                }
                
                
            },
            setClientFromClientSearch (data) {
                this.form.client.clear()
                this.form.client.set(data)
            },
            setRepresentativeFromClientSearch (data) {
                this.form.representative.clear()
                this.form.representative.set(data)
            },
            setApplicantFromClientSearch(data) {
                this.form.applicant.clear()
                this.form.applicant.set(data)
            },

            handleQACurrentChange (val) { 
                if (val) {
                    this.selectedQuestion = val.Question;
                    this.selectedAnswer = val.Answer;
                } else {
                    this.selectedQuestion = undefined;
                    this.selectedAnswer = undefined
                }
            },
            selectQA (item) {
                console.log(item)
                this.selectedQuestion = item.Question
                this.selectedAnswer = item.Answer

                /* this.selectedQuestion = ''
                this.selectedAnswer = '' */

                // this.flags.qaDialog = false
            },
            setQA () {
                this.selectedQuestion = item.Question
                this.selectedAnswer = item.Answer
            },   
            afterReasonSelected(reasonId) {
                this.form.reasonId = reasonId                
            },         
            getAQRefs (regionId, reasonId) {
                return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/Api/ClaimsQARefs`, { params: { regionId, reasonId } })
            },
            async apiGetQARefs (regionId, reasonId) {
                const { data } = await this.getAQRefs(regionId, reasonId)

                return data
            }
        },
        created () {            
            this.getCurrentUser()
            
        }
    }
</script>