/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.DemographicForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.demographicGrid',
    itemId: 'demographicGrid',

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
                        button.up('form').down('#sexValue').show();
                        button.up('form').down('#hideSex').show();
                        button.up('form').down('#showSex').hide();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Hide sex constraint',
                itemId: 'hideSex',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('form').down('#sexValue').hide();
                        button.up('form').down('#sexValue').setValue('');
                        button.up('form').down('#hideSex').hide();
                        button.up('form').down('#showSex').show();
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
                        {name: 'male', value: 'm'}
                    ]
                }
            }, {
                xtype: 'button',
                text: 'Constrain age',
                itemId: 'showAge',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('form').down('#ageComparator').show();
                        button.up('form').down('#ageValue').show();
                        button.up('form').down('#hideAge').show();
                        button.up('form').down('#showAge').hide();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Hide age',
                itemId: 'hideAge',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('form').down('#ageComparator').hide();
                        button.up('form').down('#ageValue').hide();
                        button.up('form').down('#upperAgeValue').hide();
                        button.up('form').down('#ageComparator').setValue('');
                        button.up('form').down('#ageValue').setValue('');
                        button.up('form').down('#upperAgeValue').setValue('');
                        button.up('form').down('#hideAge').hide();
                        button.up('form').down('#showAge').show();
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
                        {name: '=', value: 'eq'},
                        {name: '<', value: 'lt'},
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
                            combo.up('form').down('#upperAgeValue').show();
                        } else {
                            combo.up('form').down('#upperAgeValue').hide();
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
                        button.up('form').down('#raceValue').show();
                        button.up('form').down('#hideRace').show();
                        button.up('form').down('#showRace').hide();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Hide race/ethnicity constraint',
                itemId: 'hideRace',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('form').down('#raceValue').hide();
                        button.up('form').down('#raceValue').setValue('');
                        button.up('form').down('#hideRace').hide();
                        button.up('form').down('#showRace').show();
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