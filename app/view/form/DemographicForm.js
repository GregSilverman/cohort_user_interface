/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.DemographicForm', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.demographicGrid',
    itemId: 'demographicGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
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
                            click: function (button) {
                                button.up('grid').down('#sexId').show();
                                button.up('grid').down('#hideSex').show();
                                button.up('grid').down('#showSex').hide();
                            }
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide sex',
                        itemId: 'hideSex',
                        hidden: true,
                        listeners: {
                            click: function (button) {
                                button.up('grid').down('#sexId').hide();
                                button.up('grid').down('#sexValue').setValue('');
                                button.up('grid').down('#hideSex').hide();
                                button.up('grid').down('#showSex').show();
                            }
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
                                change: function (combo, value) {
                                    // use component query to  toggle the hidden state of upper value
                                    if (value) {
                                        combo.up('grid').down('#searchClick').enable();
                                    } else if (!value) {
                                        combo.up('grid').down('#searchClick').disable();
                                    }
                                }
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
                            click: function (button) {
                                button.up('grid').down('#vitalId').show();
                                button.up('grid').down('#hideVital').show();
                                button.up('grid').down('#showVital').hide();
                            }
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide vital status',
                        itemId: 'hideVital',
                        hidden: true,
                        listeners: {
                            click: function (button) {
                                button.up('grid').down('#vitalId').hide();
                                button.up('grid').down('#vitalStatus').setValue('');
                                button.up('grid').down('#hideVital').hide();
                                button.up('grid').down('#showVital').show();
                            }
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
                                change: function (combo, value) {
                                    // use component query to  toggle the hidden state of upper value
                                    if (value) {
                                        combo.up('grid').down('#searchClick').enable();
                                    } else if (!value) {
                                        combo.up('grid').down('#searchClick').disable();
                                    }
                                }
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
                            click: function (button) {
                                button.up('grid').down('#ageId').show();
                                button.up('grid').down('#hideAge').show();
                                button.up('grid').down('#showAge').hide();
                            }
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide age',
                        itemId: 'hideAge',
                        hidden: true,
                        listeners: {
                            click: function (button) {
                                button.up('grid').down('#ageId').hide();
                                button.up('grid').down('#ageComparator').setValue('');
                                button.up('grid').down('#ageValue').setValue('');
                                button.up('grid').down('#upperAgeValue').setValue('');
                                button.up('grid').down('#hideAge').hide();
                                button.up('grid').down('#showAge').show();
                            }
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
                                change: function (combo, value) {
                                    // use component query to  toggle the hidden state of upper value
                                    if (value === 'bt') {
                                        combo.up('grid').down('#upperAgeValue').show();
                                    } else {
                                        combo.up('grid').down('#upperAgeValue').hide();
                                    }
                                    if (value === 'prn') {
                                        combo.up('grid').down('#ageValue').hide();
                                    }
                                    if (value !== 'prn' && value !== 'bt' && value !== null) {
                                        combo.up('grid').down('#ageValue').show();
                                    }
                                }
                            }
                        },{
                            xtype: 'numberfield',
                            itemId: 'ageValue',
                            fieldLabel: 'value of',
                            listeners: {
                                change: function (fld, newValue, oldValue, opts) {
                                    // only enable if a value is being submitted
                                    if (newValue) {
                                        fld.up('grid').down('#searchClick').enable();
                                    }
                                    else if (!newValue) {
                                        fld.up('grid').down('#searchClick').disable();
                                    }
                                }
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
                            click: function (button) {
                                button.up('grid').down('#raceId').show();
                                button.up('grid').down('#hideRace').show();
                                button.up('grid').down('#showRace').hide();
                            }
                        }
                    },{
                        xtype: 'button',
                        text: 'Hide race/ethnicity',
                        itemId: 'hideRace',
                        hidden: true,
                        listeners: {
                            click: function (button) {
                                button.up('grid').down('#raceId').hide();
                                button.up('grid').down('#raceValue').setValue('');
                                button.up('grid').down('#ethnicValue').setValue('');
                                button.up('grid').down('#hideRace').hide();
                                button.up('grid').down('#showRace').show();
                            }
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