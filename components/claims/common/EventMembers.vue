<template>
    <v-card outlined class="event-members mt-6">
        <v-expansion-panels flat v-model="expansionPanels.members">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default>
                        <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                        <div class="text-uppercase blue-grey--text">Участники события</div>
                    </template>
                    <template v-slot:actions class="order-2">
                        <v-btn @click.native.stop="addMember" :disabled="disabled" text type="button" color="primary">
                            <v-icon size="16" color="primary">add_circle_outline</v-icon> Добавить
                        </v-btn>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="headers"
                        :items="members"
                        hide-default-footer
                        class="event-members-results pl-0 pr-0"
                    >
                        <template v-slot:item.id="{ item }">
                            <a @click.prevent.stop="editMember" :data-id="item.id" class="text-decoration-none">{{ item.id }}</a>                            
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon small @click.native.stop="removeMember(item)">delete</v-icon>                         
                        </template>
                    </v-data-table>                    
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <event-member-dialog 
            :dialog-title="eventMemberDialogTitle" 
            :show-dialog-flag="flags.eventMemberDialogVisible"             
            :clm-id="clmId" 
            :member-id="selectedMemberId"
            @close-dialog="closeDialog"
            @setdata="afterCreateMember"></event-member-dialog>        
    </v-card>    
</template>

<script>
    'use strict'

    import { apiEventMembersMixin } from '@/../mixins/apiEventMembersMixin'    
    import { EventMember } from "@/../classes/EventMember";
    import EventMemberDialog from "@/../components/claims/common/EventMemberDialog";

    export default {
        name: 'EventMembers',
        props: {
            clmId: Number,
            clmStateId: Number,
            showMemberDialog: Boolean
        },
        mixins: [ apiEventMembersMixin ],
        /* следим */
        watch: {},

        components: { EventMemberDialog },
        
        data () {
            return {            
                members: [],
                expansionPanels: {
                    members: 0,
                },
                headers: [
                    { text: '#', sortable: false, value: 'id', width: 62 },
                    { text: 'Тип участника', sortable: false, value: 'type.Name' },
                    { text: 'ФИО', sortable: false, value: 'fullName' },
                    { text: 'Id ЗЛ', sortable: false, value: 'clientId' },
                    { text: 'Телефон', sortable: false, value: 'phone' },
                    { text: 'Email', sortable: false, value: 'email' },
                    { text: 'Примечание', sortable: false, value: 'note' },
                    { text: 'Дата создания', sortable: false, value: 'fromDate' },
                    { text: '', sortable: false, value: 'actions' },
                    /* { text: 'Пользователь', value: 'fromDate' }, */
                ],
                eventMemberDialogTitle: "Добавление участника",            
                flags: {
                    /* флаг отображения окна создания/редактирования члена */
                    eventMemberDialogVisible: false,
                    eventMemberRemoveDialogVisible: false
                },
                
                selectedMemberId: undefined
            }
        },
        watch: {
            showMemberDialog (val) {
                if (val) {
                    this.addMember()
                }
            }
        },
        computed: {
            disabled () {
                return this.clmStateId === 21;
            },
            dialogTitle () {
                return this.eventMemberDialogTitle;
            }
        },
        methods: {
            setMembers (members) {                
                this.members = [];

                for (let i = 0; i < members.length; i++) {
                    const element = members[i];
                    var member = new EventMember();
                    
                    member.id = element.Id;
                    member.clientId = element.ClientId;
                    member.fromDate = element.CreateDate;
                    member.respectTypeId = element.RespectTypeId;
                    member.userId = element.UserId;
                    member.user = element.User;
                    member.claimId = element.ClaimId;
                    member.note = element.Note;
                    member.typeId = element.TypeId;                                        
                    member.type = element.Type;
                    member.surName = element.ClientSurname;
                    member.firstName = element.ClientFirstname;
                    member.secondName = element.ClientSecondname;
                    member.birthDate = element.ClientBirthDate;
                    member.phone = element.ClientPhone;
                    member.email = element.ClientEmail;
                    member.sexId = element.ClientSexId;
                    member.address = element.ClientAddress;

                    this.members.push(member);                                          
                }
                
                this.$emit('set-members-length', this.members.length)
            },            
            getMembers (claimId) {
                let vm = this

                this.apiGetClaimMembers(claimId)
                    .then((response) => {
                        if (response.result === "Ok") {
                            vm.setMembers(JSON.parse(response.data.members))                       
                        } else {
                            // todo: сообщение об оишбке
                        }
                    })
                    .catch((response) => {
                        if (response.status === 401) {
                            alert("Перезагрузите страницу и авторизуйтесь заново!");
                        }
                        // console.log(response);
                    })
            },
            addMember () {
                this.eventMemberDialogTitle = "Добавление участника";
                this.selectedMemberId = undefined;

                this.flags.eventMemberDialogVisible = true;
            },
            editMember (e) {                       
                this.eventMemberDialogTitle = "Редактирование участника № " + e.target.innerText
                this.selectedMemberId = Number.parseInt(e.target.innerText)

                this.flags.eventMemberDialogVisible = true
            },
            removeMember (item) {
                let vm = this
                if (confirm('Удалить участника события?')) {
                    this.apiPostRemoveClaimMember(item.id)
                        .then((response) => {                        
                            if (response.result === "Ok") {
                                vm.getMembers(vm.clmId)
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
            },
            openRemoveMemberDialog (item) {
                this.flags.eventMemberRemoveDialogVisible = true                
            },

            afterCreateMember (data) {
                this.getMembers(this.clmId);
            },
            closeDialog() {
                this.flags.eventMemberDialogVisible = false
                this.$emit('close-member-dialog')

            },
            clear () {
                this.members = [];
                this.selectedMemberId = undefined;
            },
            
        },
        created () {
            this.getMembers(this.clmId)
        },
    }
</script>