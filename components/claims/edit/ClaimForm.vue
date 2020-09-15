<template>
    <div class="claim-form">
        <v-row no-gutters>
            <v-col cols="8" class="px-3">
                <v-row no-gutters class="py-3">
                    <v-col cols="7"><h1 class="text-h6 blue-grey--text text--darken-2 font-weight-medium" style="font-size:18px;">Обращения / Редактирование обращения № {{claim.id}}</h1></v-col>
                    <v-col cols="5" class="text-right">
                        <v-btn v-if="claim.stateId == 21" @click.native.stop="openClaim" rounded depressed color="primary mx-3">Открыть</v-btn>
                        <v-btn v-if="claim.stateId == 1" @click.native.stop="prolongClaim" rounded outlined color="primary" class="white" style="border:1px solid #1a7555 !important">Продлить</v-btn>
                        <v-btn v-if="claim.stateId == 1 || claim.stateId == 20" @click.native.stop="flags.showCloseClaimDialog = true" rounded depressed color="primary mx-3">Закрыть</v-btn>
                        <claim-print-button
                            :clm-id="claim.id"
                            :clm-out-number="claim.curOutNumber"
                            :clm-out-date="claim.curOutDate"
                            :event-type-id="event.curTypeId"
                            :event-answer="event.curAnswer"
                        ></claim-print-button>
                    </v-col>                            
                </v-row>
            </v-col>
            <v-col cols="4" class="px-3"></v-col>
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
                                                <div class="text-uppercase font-weight-medium blue-grey--text text--darken-2 order-1">Общая информация (<a @click.stop="" :href="claim.agreeHref" target="_blank" class="text-uppercase text-decoration-underline">Полис</a>)</div>
                                                <div class="v-expansion-panel-header__icon order-0" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light blue-grey--text text--darken-2" style="font-size:12px;">keyboard_arrow_down</i></div>
                                            </template>
                                            <template v-slot:actions>&nbsp;</template>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <!-- <v-container> -->
                                                <v-row class="mx-0">
                                                    <v-col cols="5" class="pl-0">                                                    
                                                        <v-text-field
                                                            label="Полис"
                                                            v-model="claim.policyInfo"
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
                                                            v-model="claim.tpn"
                                                            label="ВС"
                                                            outlined
                                                                
                                                            hide-details="auto"                                     
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-text-field
                                                            v-model="claim.upn"
                                                            v-mask="'#### #### #### ####'"
                                                            label="ЕНП"
                                                            outlined
                                                            type="text"
                                                            hide-details="auto"                                                                                          
                                                        ></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mx-0">
                                                    <v-col cols="3" class="pl-0">
                                                        <v-menu
                                                            ref="createDateMenu"
                                                            v-model="createDateMenu"
                                                            :close-on-content-click="false"                                                            
                                                            transition="scale-transition"
                                                            offset-y
                                                            min-width="290px"
                                                            max-width="290px"                                              
                                                        >
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="claim.createDate"
                                                                    v-bind="attrs"
                                                                    @blur="dateTimePickerCreateDate = parseDate(claim.createDate)"
                                                                    label="Дата обращения"
                                                                    placeholder="__.__.____ __:__"                                                
                                                                    hide-details="auto"                                                                    
                                                                    outlined
                                                                                                                                
                                                                    v-on="on"
                                                                >
                                                                    <template v-slot:append>
                                                                        <v-icon color="secondary" small class="mt-1">schedule</v-icon>
                                                                    </template>
                                                                </v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="dateTimePickerCreateDate" @input="createDateMenu = false" locale="ru" first-day-of-week="1" color="primary"  no-title scrollable></v-date-picker>                                                            
                                                        </v-menu>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-select 
                                                            v-model="claim.regionId" 
                                                            :items="refsLists.regions" 
                                                            label="Регион"
                                                            hide-details="auto"
                                                            outlined
                                                            
                                                        ></v-select> 
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-select 
                                                            v-model="claim.companyId" 
                                                            :items="refsLists.companies" 
                                                            label="Компания"
                                                            hide-details="auto"
                                                            outlined
                                                            
                                                        ></v-select>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mx-0">
                                                    <v-col cols="2" class="pl-0">
                                                        <v-select 
                                                            v-model="event.typeId" 
                                                            :items="refsLists.eventForms" 
                                                            label="Форма"
                                                            hide-details="auto"
                                                            outlined
                                                                                                    
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="2">
                                                        <v-select 
                                                            v-model="event.reciptTypeId" 
                                                            :items="refsLists.claimReciptTypes" 
                                                            label="Источник"
                                                            hide-details="auto"
                                                            outlined
                                                                                                    
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-select 
                                                            v-model="claim.typeId" 
                                                            :items="refsLists.claimTypes" 
                                                            label="Тип обращения"
                                                            hide-details="auto"
                                                            outlined
                                                                                                    
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="5" class="pr-0">
                                                        <claim-reasons-dialog 
                                                            @reason-selected="afterReasonSelected" 
                                                            :claim-type-id="claim.typeId"
                                                            :claim-reason-id="claim.reasonId"
                                                            :claim-reasons="refsLists.claimReasons"
                                                            :refs-claim-reasons="refs.claimReasons"
                                                        ></claim-reasons-dialog>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mx-0">
                                                    <v-col cols="3" class="pl-0">
                                                        <v-select 
                                                            v-model="claim.validatId" 
                                                            :items="refsLists.claimSolvencies" 
                                                            label="Правильность"
                                                            hide-details="auto"
                                                            outlined
                                                                                            
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="4">
                                                        <v-select 
                                                            v-model="claim.stageId" 
                                                            :items="refsLists.claimStages" 
                                                            label="Стадия"
                                                            hide-details="auto"
                                                            outlined
                                                                                                    
                                                        ></v-select>
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-menu
                                                            ref="fromDateMenu"
                                                            v-model="fromDateMenu"
                                                            :close-on-content-click="false"                                                            
                                                            transition="scale-transition"
                                                            offset-y
                                                            min-width="290px"
                                                            max-width="290px"                                              
                                                        >
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="claim.fromDate"
                                                                    v-bind="attrs"
                                                                    @blur="dateTimePickerFromDate = parseDate(claim.fromDate)"
                                                                    label="Дата обращения"
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
                                                            <v-date-picker v-model="dateTimePickerFromDate" @input="fromDateMenu = false" locale="ru" first-day-of-week="1" color="primary"  no-title scrollable></v-date-picker>                                                            
                                                        </v-menu> 
                                                    </v-col>
                                                    <v-col cols="2" class="pr-0">
                                                        <v-menu
                                                            ref="closeDateMenu"
                                                            v-model="closeDateMenu"
                                                            :close-on-content-click="false"                                                            
                                                            transition="scale-transition"
                                                            offset-y
                                                            min-width="290px"
                                                            max-width="290px"                                              
                                                        >
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-text-field
                                                                    v-model="claim.closeDate"
                                                                    v-bind="attrs"
                                                                    @blur="datePickerCloseDate = parseDate(claim.closeDate)"
                                                                    label="Дата закрытия"
                                                                    placeholder="__.__.____"                                                
                                                                    hide-details="auto"                                                                    
                                                                    outlined
                                                                                                                                
                                                                    v-on="on"
                                                                >
                                                                    <template v-slot:append>
                                                                        <v-icon small color="secondary" class="mt-1">calendar_today</v-icon>
                                                                    </template>
                                                                </v-text-field>
                                                            </template>
                                                            <v-date-picker v-model="datePickerCloseDate" @input="closeDateMenu = false" locale="ru" first-day-of-week="1" color="primary"  no-title scrollable></v-date-picker>                                                            
                                                        </v-menu> 
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mx-0">
                                                    <v-col cols="2" class="pl-0">
                                                        <v-switch v-model="claim.repeated" inset dense label="Повторно" style="margin-top:3px"></v-switch>
                                                    </v-col>
                                                    <v-col cols="5" offset="5" class="pr-0">
                                                        <v-text-field
                                                            disabled
                                                            label="Пользователь"
                                                            v-model="claim.userName"
                                                            hide-details="auto"
                                                            outlined
                                                                                                                                                                            
                                                        ></v-text-field>
                                                    </v-col>                            
                                                </v-row>
                                            <!-- </v-container> -->
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card>
                            
                            <v-card outlined class="mt-6">
                                <v-expansion-panels flat v-model="expansionPanels.claim">
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            <template v-slot:default>
                                                <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                                                <div style="color:#455A64;">ОБРАЩЕНИЕ</div>
                                            </template>
                                            <template v-slot:actions>&nbsp;</template>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <!-- <v-container> -->
                                                <v-row class="mx-0">
                                                    <v-col cols="2" class="pl-0">
                                                        <v-menu
                                                                ref="outDateMenu"
                                                                v-model="outDateMenu"
                                                                :close-on-content-click="false"                                                            
                                                                transition="scale-transition"
                                                                offset-y
                                                                min-width="290px"
                                                                max-width="290px"                                              
                                                            >
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-text-field
                                                                        v-model="claim.outDate"
                                                                        v-bind="attrs"
                                                                        @blur="datePickerOutDate = parseDate(claim.outDate)"
                                                                        label="Дата закрытия"
                                                                        placeholder="__.__.____"                                               
                                                                        hide-details="auto"                                                                    
                                                                        outlined
                                                                                                                                    
                                                                        v-on="on"
                                                                    >
                                                                        <template v-slot:append>
                                                                            <v-icon small color="secondary" class="mt-1">calendar_today</v-icon>
                                                                        </template>
                                                                    </v-text-field>
                                                                </template>
                                                                <v-date-picker v-model="datePickerOutDate" @input="outDateMenu = false" locale="ru" first-day-of-week="1" color="primary" no-title scrollable></v-date-picker>                                                            
                                                            </v-menu>
                                                    </v-col>
                                                    <v-col cols="2">
                                                        <v-text-field
                                                                v-model="claim.actNumber"
                                                                label="Номер дела"
                                                                outlined
                                                                        
                                                                hide-details="auto"                                                                                          
                                                            ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="2">
                                                        <v-text-field
                                                                v-model="claim.outNumber"
                                                                label="Номер ответа"
                                                                outlined
                                                                        
                                                                hide-details="auto"                                                                                          
                                                            ></v-text-field>
                                                    </v-col>
                                                    <v-col cols="3" class="pr-0">
                                                        <v-menu
                                                                ref="expectCloseDateMenu"
                                                                v-model="expectCloseDateMenu"
                                                                :close-on-content-click="false"                                                            
                                                                transition="scale-transition"
                                                                offset-y
                                                                min-width="290px"
                                                                max-width="290px"                                              
                                                            >
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-text-field
                                                                        v-model="claim.expectCloseDate"
                                                                        v-bind="attrs"
                                                                        @blur="datePickerExpectCloseDate = parseDate(claim.expectCloseDate)"
                                                                        label="Ожидаемая дата закрытия"
                                                                        placeholder="__.__.____"                                                
                                                                        hide-details="auto"                                                                    
                                                                        outlined
                                                                                                                                    
                                                                        v-on="on"
                                                                    >
                                                                        <template v-slot:append>
                                                                            <v-icon small color="secondary" class="mt-1">calendar_today</v-icon>
                                                                        </template>
                                                                    </v-text-field>
                                                                </template>
                                                                <v-date-picker v-model="datePickerExpectCloseDate" @input="expectCloseDateMenu = false" locale="ru" first-day-of-week="1" color="primary" no-title scrollable></v-date-picker>                                                            
                                                            </v-menu>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mx-0">
                                                    <v-col cols="12" class="pl-0 pr-0">
                                                        <v-textarea
                                                            v-model="event.question"
                                                            rows="3"
                                                            outlined                                    
                                                            label="Вопрос"
                                                        ></v-textarea>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mx-0">
                                                    <v-col cols="12" class="pl-0 pr-0">
                                                        <v-textarea
                                                            v-model="event.answer"
                                                            rows="3"
                                                            outlined                                    
                                                            label="Ответ"
                                                        ></v-textarea>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mx-0">
                                                    <v-col cols="12" class="pl-0 pr-0">
                                                        <v-textarea
                                                            v-model="event.description"
                                                            rows="3"
                                                            outlined                                    
                                                            label="Почтовый адрес"
                                                        ></v-textarea>
                                                    </v-col>
                                                </v-row>
                                            <!-- </v-container> -->
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card>

                            <event-members 
                                :clm-id="claim.id" 
                                :clm-state-id="claim.stateId"                                
                                :show-member-dialog="flags.showMemberDialog" 
                                @close-member-dialog="flags.showMemberDialog = false"
                                @set-members-length="menu.setMembersLength" 
                            ></event-members>

                            <claim-docs 
                                :clm-id="claim.id" 
                                :clm-state-id="claim.stateId"
                                :show-doc-dialog="flags.showDocDialog" 
                                @close-doc-dialog="flags.showDocDialog = false"
                                @set-docs-length="menu.setDocsLength" 
                            ></claim-docs>

                            <claim-notes 
                                :clm-id="claim.id" 
                                :clm-state-id="claim.stateId"
                                :show-note-dialog="flags.showNoteDialog" 
                                @close-note-dialog="flags.showNoteDialog = false"
                                @set-notes-length="menu.setNotesLength" 
                            ></claim-notes>

                            <claim-expertise-acts 
                                :clm-id="claim.id" 
                                :clm-state-id="claim.stateId"
                                @set-expacts-length="menu.setExpActsLength"
                            ></claim-expertise-acts>

                            <claim-journal 
                                :clm-id="claim.id" 
                                :clm-state-id="claim.stateId"
                                @set-journal-length="menu.setJournalLength"
                            ></claim-journal>

                            <event-claims 
                                :evnt-id="claim.eventId"
                                @set-eventclaims-length="menu.setEventClaimsLength"
                            ></event-claims>

                            <search-agree-dialog 
                                :show-dialog-flag="flags.searchAgreeDialogVisible" 
                                @close-dialog="flags.searchAgreeDialogVisible = false" 
                                @setdata="setAgreeFromAgreeSearch" 
                                dialog-title="Поиск полиса"
                            ></search-agree-dialog>
                        </v-form>                    
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="4" class="px-3">
                <v-row no-gutters class="py-3">
                    <v-col cols="12">
                        <div class="claim-menu">
                            <v-list class="py-0" style="background:none">
                                <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                                    <v-list-item-content>
                                        <v-list-item-title class="blue-grey--text text--darken-4 font-weight-medium" style="letter-spacing: 0.4px;">Участники события ({{ menu.members }})</v-list-item-title>                    
                                    </v-list-item-content>
                                    <v-list-item-action class="my-2">
                                        <v-btn small icon @click.native.stop="flags.showMemberDialog = true" :disabled="claim.stateId == 21">
                                            <v-icon small color="secondary">add_circle_outline</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                                    <v-list-item-content>
                                        <v-list-item-title class="blue-grey--text text--darken-4 font-weight-medium" style="letter-spacing: 0.4px;">Документы ({{ menu.docs }})</v-list-item-title>                    
                                    </v-list-item-content>
                                    <v-list-item-action class="my-2">
                                        <v-btn small icon @click.native.stop="flags.showDocDialog = true" :disabled="claim.stateId == 21">
                                            <v-icon small color="secondary">add_circle_outline</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                                    <v-list-item-content>
                                        <v-list-item-title class="blue-grey--text text--darken-4 font-weight-medium" style="letter-spacing: 0.4px;">Заметки ({{ menu.notes }})</v-list-item-title>                    
                                    </v-list-item-content>
                                    <v-list-item-action class="my-2">
                                        <v-btn small icon @click.native.stop="flags.showNoteDialog = true" :disabled="claim.stateId == 21">
                                            <v-icon small color="secondary">add_circle_outline</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                                <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                                    <v-list-item-content>
                                        <v-list-item-title class="blue-grey--text text--darken-4 font-weight-medium" style="letter-spacing: 0.4px;">Акты экспертиз ({{ menu.expActs }})</v-list-item-title>                    
                                    </v-list-item-content>                                    
                                </v-list-item>
                                <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                                    <v-list-item-content>
                                        <v-list-item-title class="blue-grey--text text--darken-4 font-weight-medium" style="letter-spacing: 0.4px;">Журнал ({{ menu.journal }})</v-list-item-title>                    
                                    </v-list-item-content>                
                                </v-list-item>
                                <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                                    <v-list-item-content>
                                        <v-list-item-title class="blue-grey--text text--darken-4 font-weight-medium" style="letter-spacing: 0.4px;">Все обращения клиента ({{ menu.eventClaims }})</v-list-item-title>                    
                                    </v-list-item-content>                
                                </v-list-item>
                            
                            </v-list>
                        </div>
                        <v-row no-gutters>
                            <v-col cols="12" class="py-4">
                                <v-btn rounded depressed class="white" color="secondary">
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
            v-model="flags.showCloseClaimDialog" 
            persistent 
            max-width="247px">
            <v-card>
                <v-card-title>
                    <span class="subtitle-2" style="font-size: 1rem !important;">Закрытие обращения</span>   
                    <v-spacer></v-spacer>
                    <v-btn @click.stop="flags.showCloseClaimDialog = false" icon class="pr-0"><v-icon>close</v-icon></v-btn>
                </v-card-title>            
                <v-card-text>
                        <div class="close-claim-dialog">
                            <v-form>
                                <v-row class="pl-1 pr-1">
                                    <v-col cols="12"  >
                                        <v-select 
                                            v-model="claimCloseStageId" 
                                            :items="getCloseStages" 
                                            label="Стадия"
                                            hide-details="auto"
                                            outlined
                                        ></v-select>
                                    </v-col>
                                </v-row>
                                <v-row  class="pl-1 pr-1">
                                    <v-col cols="12">
                                        <v-btn @click.stop="closeClaim" block depressed color="primary">
                                            Закрыть                            
                                        </v-btn>  
                                    </v-col>
                                </v-row>
                            </v-form>
                        </div>
                </v-card-text>
            </v-card>
        </v-dialog>    
    </div>
</template>

<script>     
// TODO: Проблема с датой закрытия, должна быть только дата, а там есть и время 
// TODO: Установить маску для ЕНП
// TODO: ПРоблема с остальными нераскрытыми панелями в дизайне
// TODO: Получать данные ивена в этом же компоненте
    'use strict'

    import { requestsMixin } from '@/../mixins/requestsMixin'
    import { datesMixin } from '@/../mixins/datesMixin'
    import { baseRefsMixin } from '@/../mixins/baseRefsMixin'
    import { claimRefsMixin } from '@/../mixins/claimRefsMixin'
    import { editClaim } from '@/../entities/editClaim'
    import { editEvent } from '@/../entities/editEvent'
    /* маска для полей */
    import { mask } from 'vue-the-mask'    
    
    /* компоненты */
    import SearchAgreeDialog from "@/../components/common/SearchAgreeDialog"
    import EventMembers from "@/../components/claims/common/EventMembers"
    import ClaimDocs from "@/../components/claims/common/ClaimDocs"
    import ClaimNotes from "@/../components/claims/common/ClaimNotes"
    import ClaimExpertiseActs from "@/../components/claims/common/ClaimExpertiseActs"
    import ClaimJournal from "@/../components/claims/common/ClaimJournal"
    import EventClaims from "@/../components/claims/common/EventClaims"
    import ClaimReasonsDialog from "@/../components/claims/common/ClaimReasonsDialog"
    import ClaimMenu from "@/../components/claims/edit/ClaimMenu"
    import ClaimPrintButton from "@/../components/ClaimPrintButton"
    // import ClaimEvent from "../components/ClaimEvent"
    // import ClaimStatuses from "../components/ClaimStatuses"

    export default {
        name: 'ClaimForm',
        directives: { mask },
        components: { SearchAgreeDialog, EventMembers, ClaimDocs, ClaimNotes, ClaimExpertiseActs, ClaimJournal, EventClaims, ClaimMenu, ClaimPrintButton, ClaimReasonsDialog },
        mixins: [ requestsMixin, baseRefsMixin, claimRefsMixin, datesMixin ],
        props: {},                
        watch: {
            dateTimePickerCreateDate (val) {
                this.claim.createDate = this.formatDate(val)
            },
            dateTimePickerFromDate (val) {
                this.claim.fromDate = this.formatDate(val)
            },
            datePickerCloseDate (val) {
                this.claim.closeDate = this.formatDate(val)
            },
            datePickerOutDate (val) {
                this.claim.outDate = this.formatDate(val)
            },
            datePickerExpectCloseDate (val) {
                this.claim.expectCloseDate = this.formatDate(val)
            }
        },
        data () {
            var vm = this;
            
            return {
                expansionPanels: {
                    common: 0,
                    claim: 0,                                                        
                                    
                    claims: 0
                },
                /* Отражает кол-во записей в меню, ф-ии set реагируют на ивент */
                menu: {
                    members: 0,
                    docs: 0,
                    notes: 0,
                    expActs: 0,
                    journal: 0,
                    eventClaims: 0,

                    setMembersLength (val) { vm.menu.members = (val) ? val : 0 },
                    setDocsLength (val) { vm.menu.docs = (val) ? val : 0 },
                    setNotesLength (val) { vm.menu.notes = (val) ? val : 0 },
                    setExpActsLength (val) { vm.menu.expActs = (val) ? val : 0 },
                    setJournalLength (val) { vm.menu.journal = (val) ? val : 0 },
                    setEventClaimsLength (val) { vm.menu.eventClaims = (val) ? val : 0 },
                },               

                flags: {
                    searchAgreeDialogVisible: false,
                    searchClientDialogVisible: false,
                    searchRepresentativeDialogVisible: false,
                    searchApplicantDialogVisible: false,
                    /* отвечает за показ диалогового окна Вопросы и ответы */
                    dialogQAVisible: false,
                    popoverQAbvisible: false,

                    showMemberDialog: false,
                    showDocDialog: false,
                    showNoteDialog: false,

                    showCloseClaimDialog: false
                },                
                // searchQA: '',
                /* Выбранные вопрос и ответ */
                // selectedQuestion: '',
                // selectedAnswer: '',
                claim: editClaim,
                event: editEvent, 
                
                claimCloseStageId: null,

                /* датапикеры */
                dateTimePickerCreateDate: new Date().toISOString(),
                dateTimePickerFromDate: new Date().toISOString(),
                datePickerCloseDate: new Date().toISOString().substr(0, 10),
                datePickerOutDate: new Date().toISOString().substr(0, 10),
                datePickerExpectCloseDate: new Date().toISOString().substr(0, 10),
                createDateMenu: false,
                fromDateMenu: false,
                closeDateMenu: false,
                outDateMenu: false,
                expectCloseDateMenu: false
            }
        },
        computed: {
            getEventId () {
                return this.claim.eventId
            },
            getCloseStages () {
                let closeStages = this.refs.claimStages.filter(s => s.StartUp === 'C' && s.Id !== 526)                
                return closeStages.map(function(item, index, array) {
                    return { text: item.Name, value: item.Id };
                })
            } 
        },
        methods: {
            openClaim () {},
            prolongClaim () {},
            closeClaim () {},
            afterCloseClaimDialog () {
                
            },
            afterReasonSelected(reasonId) {
                this.claim.reasonId = reasonId                
            },
            setAgreeFromAgreeSearch (data) {
            
                this.claim.agreeId = data.Id
                this.claim.fullname = data.Fullname
                this.claim.policyInfo = data.Info
            },                      
            /**
             * Возвращает претензию и событие
             */
            async apiGetClaimAndEvent (id) {
                const { data } = await this.getClaimAndEvent(id);

                return data;                
            },
            /**
             * ОБновление претензии
             */
            async apiPostUpdClaim () {
                const { data } = await this.postUpdClaim(this.claim.getAspModel());
            }                
        },
        created () {     
            var vm = this;
            // OMInsurance.claimId приходит из главного шаблона
            this.claim.id = OMInsurance.claimId;

            this.apiGetClaimAndEvent(this.claim.id)
                .then((response) => {
                    if (response.result === "Ok") {
                        this.claim.set(JSON.parse(response.data.claim));
                        this.event.set(JSON.parse(response.data.evnt));                        
                    }
                })
                .catch((response) => {
                    if (response.status === 401) {
                        alert("Перезагрузите страницу и авторизуйтесь заново!");
                    }
                });
        },
        mounted () { }
    }
</script>