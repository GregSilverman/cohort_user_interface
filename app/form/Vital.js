/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.form.Vital', {
    extend: 'Ext.form.Panel',
    alias : 'widget.vitalForm',
    config: {
        variableHeights: false,
        title: 'Vitals',
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
        }, {
            itemId: 'vitals',
            items: [{
                xtype: 'combo',
                itemId: 'systolicComparator',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select systolic bp that is',
                displayField: 'name',
                valueField: 'value',
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
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value === 'bt') {
                            combo.up('form').down('#upperSystolic').show();
                        } else {
                            combo.up('form').down('#upperSystolic').hide();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                itemId: 'systolicValue',
                fieldLabel: 'value of',
                value: ''
            }, {
                xtype: 'numberfield',
                itemId: 'upperSystolic',
                fieldLabel: 'and',
                hidden: true
            }, {
                xtype: 'tbspacer',
                height: 25
            }, { // Diastolic
                xtype: 'combo',
                itemId: 'diastolicComparator',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select diastolic bp that is',
                displayField: 'name',
                valueField: 'value',
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
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value === 'bt') {
                            combo.up('form').down('#upperDiastolic').show();
                        } else {
                            combo.up('form').down('#upperDiastolic').hide();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                itemId: 'diastolicValue',
                fieldLabel: 'value of',
                value: ''
            }, {
                xtype: 'numberfield',
                itemId: 'upperDiastolic',
                fieldLabel: 'and',
                hidden: true
            },{
                xtype: 'tbspacer',
                height:25
            },{ // Diastolic
                xtype: 'combo',
                itemId: 'diastolicComparator',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select diastolic bp that is',
                displayField: 'name',
                valueField: 'value',
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
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value === 'bt') {
                            combo.up('form').down('#upperDiastolic').show();
                        } else {
                            combo.up('form').down('#upperDiastolic').hide();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                itemId: 'diastolicValue',
                fieldLabel: 'value of',
                value: ''
            }, {
                xtype: 'numberfield',
                itemId: 'upperDiastolic',
                fieldLabel: 'and',
                hidden: true
            },{
                xtype: 'tbspacer',
                height:25
            },{
                xtype: 'button',
                text: 'Constrain search by date range',
                itemId: 'showWhen',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('form').down('#whenComparator').show();
                        button.up('form').down('#whenValue').show();
                        button.up('form').down('#hideWhen').show();
                        button.up('form').down('#showWhen').hide();
                    }
                }
            },{
                xtype: 'button',
                text: 'Hide date range',
                itemId: 'hideWhen',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('form').down('#whenComparator').hide();
                        button.up('form').down('#whenValue').hide();
                        button.up('form').down('#upperWhenValue').hide();
                        button.up('form').down('#whenComparator').setValue('');
                        button.up('form').down('#whenValue').setValue('');
                        button.up('form').down('#upperWhenValue').setValue('');
                        button.up('form').down('#hideWhen').hide();
                        button.up('form').down('#showWhen').show();
                    }
                }
            }, { // When
                xtype: 'combo',
                itemId: 'whenComparator',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select vital date that is',
                displayField: 'name',
                valueField: 'value',
                hidden: true,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {name: '<=', value: 'le'},
                        {name: '>=', value: 'ge'},
                        {name: 'between', value: 'bt'}
                    ]
                },

                listeners: {
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value === 'bt') {
                            combo.up('form').down('#upperWhenValue').show();
                        } else {
                            combo.up('form').down('#upperWhenValue').hide();
                        }
                    }
                }
            }, {
                xtype: 'datefield',
                itemId: 'whenValue',
                fieldLabel: 'value of',
                hidden: true,
                hideTrigger:true
            }, {
                xtype: 'datefield',
                itemId: 'upperWhenValue',
                fieldLabel: 'and',
                hidden: true,
                hideTrigger:true
            }]
        }],
        lbar: [{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Save criteria',
            handler: 'onSubmitVitals'
        }] // end vitals
    }
});