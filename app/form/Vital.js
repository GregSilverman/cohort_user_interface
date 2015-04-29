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
            },{ // When
                xtype: 'combo',
                itemId: 'vitalWhenComparator',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select vital date that is',
                displayField: 'name',
                valueField: 'value',
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
                            combo.up('form').down('#upperVitalWhen').show();
                        } else {
                            combo.up('form').down('#upperVitalWhen').hide();
                        }
                    }
                }
            }, {
                xtype: 'datefield',
                itemId: 'vitalWhenValue',
                fieldLabel: 'value of',
                hideTrigger:true
            }, {
                xtype: 'datefield',
                itemId: 'upperVitalWhen',
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