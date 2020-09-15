<template>
    <v-dialog 
        v-model="showDialogFlag" 
        persistent 
        max-width="600px">
        <v-card>
            <v-card-title>
                <span class="subtitle-2" style="font-size: 1rem !important;">{{dialogTitle}}</span>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon @click="afterClose">close</v-icon>          
                </v-btn>
            </v-card-title>            
            <v-card-text>
                <event-member-form 
                    :show-dialog-flag="showDialogFlag" 
                    :clm-id="clmId" 
                    :member-id="memberId"                
                    @close-dialog="afterClose"
                    @setdata="afterCreateMember"></event-member-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    'use strict'
    /* форма создания претензии */
    import EventMemberForm from "./EventMemberForm";

    export default {
        name: 'EventMemberDialog',
        components: { EventMemberForm },
        props: {
            clmId: Number,
            memberId: Number,
            dialogTitle: String,
            showDialogFlag: Boolean
        },        
        methods: {
            /* закрытие окна */
            afterClose () {            
                this.$emit('close-dialog')
            },
            afterCreateMember (data) {
                this.$emit("setdata", data)
                this.$emit('close-dialog')
            }
        }
    }
</script>