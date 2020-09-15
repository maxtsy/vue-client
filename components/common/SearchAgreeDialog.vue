<template>
    <v-dialog 
        v-model="showDialogFlag" 
        persistent 
        max-width="842px">
        <v-card>
            <v-card-title>
                <span class="subtitle-2" style="font-size: 1rem !important;">{{dialogTitle}}</span>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon @click="afterClose">close</v-icon>          
                </v-btn>
            </v-card-title>            
            <v-card-text>
                <search-agree :show-dialog-flag="showDialogFlag" @close-dialog="afterClose" @setdata="setAgree"></search-agree>             
            </v-card-text>
        </v-card>
    </v-dialog>    
</template>
<script>
    /* форма поиска */
    import SearchAgree from '@/../components/common/SearchAgree'    

    export default {
        name: 'SearchAgreeDialog',
        components: { SearchAgree },
        props: {
            dialogTitle: String,
            showDialogFlag: Boolean
        },
        data () {
            return {

            }
        },
        methods: {                 
            afterClose () { /* закрытие окна, отправка события в родительский компонент */ this.$emit('close-dialog'); },
            setAgree (data) { this.$emit('setdata', data); }
        }
    }    
</script>