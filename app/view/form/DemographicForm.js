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
            items: [{
                xtype: 'button',
                text: 'Constrain sex',
                itemId: 'showSex',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#sexValue').show();
                        button.up('grid').down('#hideSex').show();
                        button.up('grid').down('#showSex').hide();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Hide sex constraint',
                itemId: 'hideSex',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#sexValue').hide();
                        button.up('grid').down('#sexValue').setValue('');
                        button.up('grid').down('#hideSex').hide();
                        button.up('grid').down('#showSex').show();
                    }
                }
            },{ // Sex
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
                hidden: true,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'female', value: 'f'},
                        {name: 'male', value: 'm'},
                        {name: 'any', value: 'prn'}
                    ]
                }
            }, {
                xtype: 'button',
                text: 'Constrain age',
                itemId: 'showAge',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#ageComparator').show();
                        button.up('grid').down('#ageValue').show();
                        button.up('grid').down('#hideAge').show();
                        button.up('grid').down('#showAge').hide();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Hide age',
                itemId: 'hideAge',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#ageComparator').hide();
                        button.up('grid').down('#ageValue').hide();
                        button.up('grid').down('#upperAgeValue').hide();
                        button.up('grid').down('#ageComparator').setValue('');
                        button.up('grid').down('#ageValue').setValue('');
                        button.up('grid').down('#upperAgeValue').setValue('');
                        button.up('grid').down('#hideAge').hide();
                        button.up('grid').down('#showAge').show();
                    }
                }
            }, { // Age
                xtype: 'combo',
                itemId: 'ageComparator',
                queryMode: 'local',
                editable: false,
                value: '',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select age that is',
                displayField: 'name',
                valueField: 'value',
                hidden: true,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'all', value: 'prn'},
                        {name: '=', value: 'eq'},
                        {name: '<=', value: 'le'},
                        {name: '>', value: 'gt'},
                        {name: '>=', value: 'ge'},
                        {name: 'between', value: 'bt'}
                    ]
                },

                listeners: {
                    change: function(combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value === 'bt') {
                            combo.up('grid').down('#upperAgeValue').show();
                        } else {
                            combo.up('grid').down('#upperAgeValue').hide();
                        }
                        if (value === 'pr') {
                            combo.up('grid').down('#ageValue').hide();
                        } else {
                            combo.up('grid').down('#ageValue').show();
                        }
                    }
                }
            },{
                xtype: 'numberfield',
                itemId: 'ageValue',
                fieldLabel: 'value of',
                value: '',
                hidden: true
            },{
                xtype: 'numberfield',
                itemId: 'upperAgeValue',
                fieldLabel: 'and',
                hidden: true
            },{
                xtype: 'button',
                text: 'Constrain race/ethnicity',
                itemId: 'showRace',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#raceValue').show();
                        button.up('grid').down('#hideRace').show();
                        button.up('grid').down('#showRace').hide();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Hide race/ethnicity constraint',
                itemId: 'hideRace',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#raceValue').hide();
                        button.up('grid').down('#raceValue').setValue('');
                        button.up('grid').down('#hideRace').hide();
                        button.up('grid').down('#showRace').show();
                    }
                }
            },{ // Race
                xtype: 'combo',
                itemId: 'raceValue',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select race',
                displayField: 'name',
                valueField: 'value',
                hidden: true,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'female', value: 'f'},
                        {name: 'male', value: 'm'}
                    ]
                }
            },{
                //minWidth: 80,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitDemographics'
            }]
        }] // end demographics
    }


});