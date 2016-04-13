/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.Demographic', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.demographicGrid',
    itemId: 'demographicGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController',
        'Ext.button.Button'
    ],

    config: {
        variableHeights: false,
        title: 'Demographics',
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
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Constrain sex',
                        itemId: 'showSex',
                        hidden: false,
                        listeners: {
                            click: 'unhideSex'
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide sex',
                        itemId: 'hideSex',
                        hidden: true,
                        listeners: {
                            click: 'hideSex'
                        }
                    },{
                        xtype: 'fieldset',
                        title: 'Constrain sex',
                        hidden: true,
                        itemId: 'sexId',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [{ // Sex
                            xtype: 'combo',
                            itemId: 'sexValue',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select sex',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name: 'female', value: 'f'},
                                    {name: 'male', value: 'm'},
                                    {name: 'any', value: 'prn'}
                                ]
                            },
                            listeners: {
                                change: 'searchComboChange'
                            }
                        }]
                    }]
                },{
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Constrain vital status',
                        itemId: 'showVital',
                        hidden: false,
                        listeners: {
                            click: 'unhideVital'
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide vital status',
                        itemId: 'hideVital',
                        hidden: true,
                        listeners: {
                            click: 'hideVital'
                        }
                    },{
                        xtype: 'fieldset',
                        title: 'Constrain vital status',
                        hidden: true,
                        itemId: 'vitalId',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [{ // Vitals
                            xtype: 'combo',
                            itemId: 'vitalStatus',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select vital status',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name: 'Alive', value: 'l'},
                                    {name: 'Deceased', value: 'd'},
                                    {name: 'any', value: 'prn'}
                                ]
                            },
                            listeners: {
                                change: 'searchComboChange'
                            }
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
                        text: 'Constrain age',
                        itemId: 'showAge',
                        hidden: false,
                        listeners: {
                            click: 'unhideAge'
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide age',
                        itemId: 'hideAge',
                        hidden: true,
                        listeners: {
                            click: 'hideAge'
                        }
                    },{
                        xtype: 'fieldset',
                        title: 'Constrain age',
                        hidden: true,
                        itemId: 'ageId',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [{ // Age
                            xtype: 'combo',
                            itemId: 'ageComparator',
                            width: 300,
                            queryMode: 'local',
                            editable: false,
                            value: '',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select age that is',
                            displayField: 'name',
                            valueField: 'value',
                            store: {
                                fields: ['name', 'value'],
                                data: [
                                    {name: 'all', value: 'prn'},
                                    {name: '=', value: 'eq'},
                                    {name: '< (less than)', value: 'lt'},
                                    {name: '<= (less than) or equal)', value: 'lete'},
                                    {name: '> (greater than)', value: 'gt'},
                                    {name: '>= (greater than or equal)', value: 'grte'},
                                    {name: 'between', value: 'bt'}
                                ]
                            },
                            listeners: {
                                change: 'upperAgeValue'
                            }
                        },{
                            xtype: 'numberfield',
                            itemId: 'ageValue',
                            fieldLabel: 'value of',
                            listeners: {
                                change: 'searchTextChange'
                            }
                        }, {
                            xtype: 'numberfield',
                            itemId: 'upperAgeValue',
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
                        text: 'Constrain race/ethnicity',
                        itemId: 'showRace',
                        hidden: false,
                        listeners: {
                            click: 'unhideRaceEthnicity'
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide race/ethnicity',
                        itemId: 'hideRace',
                        hidden: true,
                        listeners: {
                            click: 'hideRaceEthnicity'
                        }
                    },{
                        xtype: 'fieldset',
                        title: 'Constrain race/ethnicity',
                        hidden: true,
                        itemId: 'raceId',
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'hbox',
                                defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                            }
                        },
                        items: [{ // Race
                            xtype: 'combo',
                            itemId: 'raceValue',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select race',
                            displayField: 'description',
                            fieldName: 'description',
                            valueField: 'description',
                            store: 'Races'
                        },{ // Ethnicity
                            xtype: 'combo',
                            itemId: 'ethnicValue',
                            queryMode: 'local',
                            editable: false,
                            value: 'eq',
                            triggerAction: 'all',
                            forceSelection: true,
                            fieldLabel: 'Select ethnicity',
                            displayField: 'description',
                            fieldName: 'description',
                            valueField: 'description',
                            store: 'Ethnicities'
                        }]
                    }]
                }]
            }] // end demographics
        }]
    }
});