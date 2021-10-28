<template>
    <div class="claim-menu">
        <v-list class="py-0" style="background:none">
            <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                <v-list-item-content>
                    <v-list-item-title color="secondary" class="font-weight-medium">Участники события (2)</v-list-item-title>                    
                </v-list-item-content>
                <v-list-item-action class="my-2">
                    <v-btn small icon>
                        <v-icon small color="secondary">add_circle_outline</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                <v-list-item-content>
                    <v-list-item-title color="secondary" class="font-weight-medium">Документы (2)</v-list-item-title>                    
                </v-list-item-content>
                <v-list-item-action class="my-2">
                    <v-btn small icon>
                        <v-icon small color="secondary">add_circle_outline</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                <v-list-item-content>
                    <v-list-item-title color="secondary" class="font-weight-medium">Заметки (2)</v-list-item-title>                    
                </v-list-item-content>
                <v-list-item-action class="my-2">
                    <v-btn small icon>
                        <v-icon small color="secondary">add_circle_outline</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                <v-list-item-content>
                    <v-list-item-title color="secondary" class="font-weight-medium">Акты экспертиз (2)</v-list-item-title>                    
                </v-list-item-content>
                <v-list-item-action class="my-2">
                    <v-btn small icon>
                        <v-icon small color="secondary">add_circle_outline</v-icon>
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                <v-list-item-content>
                    <v-list-item-title color="secondary" class="font-weight-medium">Журнал (2)</v-list-item-title>                    
                </v-list-item-content>                
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #ECEFF1;">
                <v-list-item-content>
                    <v-list-item-title color="secondary" class="font-weight-medium">Все обращения клиента (2)</v-list-item-title>                    
                </v-list-item-content>                
            </v-list-item>
           
        </v-list>
    </div>
</template>
<script>
    'use strict'
    export default {
        name: 'ClaimMenu'
    }
</script>