/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.form.Demographic', {
    extend: 'Ext.form.Panel',
    alias: 'widget.demographicForm',
    config: {
        variableHeights: false,
        title: 'Demographics',
        xtype: 'form',
        width: 200,
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
        items: [{
            xtype: 'tbspacer',
            height: 25
        },{
            itemId: 'demographics',
            items: [{
                xtype: 'button',
                text: 'Constrain by sex',
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
            },{
                xtype: 'tbspacer',
                height: 50
            }, {
                xtype: 'button',
                text: 'Constrain Age',
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
            }]
        }],
        lbar:[{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Save criteria',
            handler: 'onSubmitDemographics'
        }] // end demographics
    }


});