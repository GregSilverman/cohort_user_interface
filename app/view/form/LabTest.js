/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.LAbTest', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.labTestGrid',
    itemId: 'LabTestrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController',
        'Ext.button.Button'
    ],

    config: {
        variableHeights: false,
        title: 'LabTest',
        xtype: 'form',
        width: 500,
        bodyPadding: 10,
        defaults: {
            //anchor: '100%',
            labelWidth: 100
        },

        // inline buttons
        dockedItems: [{
            itemId: 'demographics',
            bodyStyle: 'margin: 10px; padding: 5px 3px;',
            items: [{
                width: 600,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitDemographics'
            },{
                xtype: 'tbspacer',
                height: 5
            },{
                xtype: 'fieldcontainer',
                margin: '0 5 0 0',
                combineErrors: true,
                msgTarget: 'side',
                layout: 'hbox',
                defaults: {
                    flex: 1,
                    hideLabel: true
                },
                items: [{
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Constrain lab by value',
                        itemId: 'showLabQuant',
                        hidden: false,
                        listeners: {
                            click: 'onShowLabQuant'
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide lab',
                        itemId: 'hideLabQuant',
                        hidden: true,
                        listeners: {
                            click: 'onHideLabQuant'
                        }
                    },{
                        xtype: 'fieldset',
                        title: 'Constrain lab',
                        hidden: true,
                        itemId: 'labQuantId',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [{
                            xtype: 'combo',
                            flex: 1,
                            width: 400,
                            itemId: 'labQuantCode',
                            queryMode: 'local',
                            triggerAction: 'all',
                            forceSelection: true,
                            loading: true,
                            fieldLabel: 'Select lab type',
                            displayField: 'description',
                            fieldName: 'description',
                            valueField: 'code',
                            value: '',//'13457-7',
                            store: 'Labs',
                            // set label with units
                            listeners: {
                                change: 'onToggleLabQuant',
                                scope: 'controller'
                            }
                        },{
                            xtype: 'combo',
                            flex: 1,
                            itemId: 'labQuantComparator',
                            width: 300,
                            queryMode: 'local',
                            editable: false,
                            value: '',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'that is',
                            displayField: 'name',
                            valueField: 'value',
                            //hidden: true,
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name: 'all', value: 'prn'},
                                    {name: '=', value: 'eq'},
                                    {name: '< (less than)', value: 'lt'},
                                    {name: '<= (less than or equal)', value: 'lete'},
                                    {name: '> (greater than)', value: 'gt'},
                                    {name: '>= (greater than or equal)', value: 'grte'},
                                    {name: 'between', value: 'bt'}
                                ]
                            },
                            listeners: {
                                change: 'onToggleUpperLabQuant',
                                scope: 'controller'
                            }
                        },{
                            xtype: 'numberfield',
                            itemId: 'labQuantValue',
                            fieldLabel: 'value of',
                            listeners: {
                                change: 'searchTextChange'
                            }
                        }, {
                            xtype: 'numberfield',
                            itemId: 'upperLabQuantValue',
                            fieldLabel: 'and',
                            hidden: true
                        }]
                    }]
                },{
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Constrain lab by quality',
                        itemId: 'showLabQual',
                        hidden: false,
                        listeners: {
                            click: 'onShowLabQual'
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide lab',
                        itemId: 'hideLabQual',
                        hidden: true,
                        listeners: {
                            click: 'onHideLabQual'
                        }
                    },{
                        xtype: 'fieldset',
                        title: 'Constrain lab',
                        hidden: true,
                        itemId: 'labQualId',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [{
                            xtype: 'combo',
                            flex: 1,
                            width: 400,
                            itemId: 'labQualCode',
                            queryMode: 'local',
                            triggerAction: 'all',
                            forceSelection: true,
                            loading: true,
                            fieldLabel: 'Select lab type',
                            displayField: 'description',
                            fieldName: 'description',
                            valueField: 'code',
                            value: '',//'13457-7',
                            store: 'Labs',
                            // set label with units
                            listeners: {
                                change: 'onToggleLab',
                                scope: 'controller'
                            }
                        },{
                            xtype: 'combo',
                            flex: 1,
                            itemId: 'labQual',
                            width: 300,
                            queryMode: 'local',
                            editable: false,
                            value: '',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'that is',
                            displayField: 'name',
                            valueField: 'value',
                            //hidden: true,
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name: 'low', value: 'low'},
                                    {name: 'normal', value: 'normal'},
                                    {name: 'high', value: 'high'}
                                ]
                            }
                        }]
                    }]
                },{
                    xtype: 'fieldset',
                    border: false,
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Constrain search by date range',
                        itemId: 'showWhen',
                        hidden: false,
                        listeners: {
                            click: 'onUnhideDate',
                            scope: 'controller'
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide date range',
                        itemId: 'hideWhen',
                        hidden: true,
                        listeners: {
                            click: 'onHideDate',
                            scope: 'controller'
                        }
                    },{
                        xtype: 'fieldset',
                        title: 'Constrain by date',
                        hidden: true,
                        itemId: 'whenId',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [{ // When
                            xtype: 'combo',
                            width: 300,
                            itemId: 'whenComparator',
                            queryMode: 'local',
                            editable: false,
                            value: '',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select lab date that is',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name: '<= (less than or equal)', value: 'le'},
                                    {name: '>= (greater than or equal)', value: 'ge'},
                                    {name: 'between', value: 'bt'}
                                ]
                            },

                            listeners: {
                                change: 'onUpperDate',
                                scope: 'controller'
                            }
                        },{
                            xtype: 'fieldcontainer',
                            combineErrors: true,
                            msgTarget : 'side',
                            defaults: {
                                hideLabel: true
                            },
                            items: [ {
                                xtype: 'datefield',
                                width: 200,
                                itemId: 'whenValue',
                                fieldLabel: 'value of',
                                hideTrigger:true
                            },{
                                xtype: 'datefield',
                                width: 200,
                                itemId: 'upperWhenValue',
                                fieldLabel: 'and',
                                hidden: true,
                                hideTrigger:true
                            }]
                        }]
                    }]
                }]
            }] // end demographics
        }]
    }
});