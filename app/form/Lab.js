/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.form.Lab', {
    extend: 'Ext.form.Panel',
    alias : 'widget.labForm',
    config: {
        variableHeights: false,
        title: 'Labs',
        xtype: 'form',
        width: 200,
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },
        items: [{
            itemId: 'labs',
            items: [{
                xtype: 'combo',
                flex: 1,
                width: 400,
                itemId: 'labCode',
                queryMode: 'local',
                editable: false,
                triggerAction: 'all',
                forceSelection: true,
                loading: true,
                fieldLabel: 'Select lab type',
                displayField: 'description',
                fieldName: 'description',
                valueField: 'code',
                value: '13457-7',
                store: 'Labs'
            },
            {
                xtype: 'combo',
                flex: 1,
                itemId: 'labComparator',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'that is',
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
                            combo.up('form').down('#upperLab').show();
                        } else {
                            combo.up('form').down('#upperLab').hide();
                        }
                    }
                }
            },
            {
                xtype: 'numberfield',
                itemId: 'labValue',
                fieldLabel: 'Min value',
                value: ''
            },
            {
                xtype: 'numberfield',
                itemId: 'upperLab',
                fieldLabel: 'and',
                hidden: true
            }, {
                xtype: 'tbspacer',
                width: 50
            }, {
                xtype: 'button',
                text: 'Select another lab',
                listeners: {
                    click: function (button) {
                        button.up('form').down('#labCodeSecond').show();
                        button.up('form').down('#labComparatorSecond').show();
                        button.up('form').down('#labValueSecond').show();
                    }
                }
            }, {
                xtype: 'combo',
                flex: 1,
                width: 400,
                itemId: 'labCodeSecond',
                queryMode: 'local',
                editable: false,
                triggerAction: 'all',
                forceSelection: true,
                loading: true,
                fieldLabel: 'Select lab type',
                displayField: 'description',
                fieldName: 'description',
                valueField: 'code',
                hidden: true,
                value: '',
                store: 'Labs'
            },
            {
                xtype: 'combo',
                flex: 1,
                itemId: 'labComparatorSecond',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'that is',
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
                    change: function (combo, value) {
                        // use component query to  toggle the hidden state of upper value
                        if (value === 'bt') {
                            combo.up('form').down('#upperLabSecond').show();
                        } else {
                            combo.up('form').down('#upperLabSecond').hide();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                itemId: 'labValueSecond',
                fieldLabel: 'Min value',
                value: '',
                hidden: true
            }, {
                xtype: 'numberfield',
                itemId: 'upperLabSecond',
                fieldLabel: 'and',
                hidden: true
            }, {
                xtype: 'tbspacer',
                height:25
            }, {
                    xtype: 'button',
                    text: 'Constrain search by date range',
                    itemId: 'showWhen',
                    hidden: false,
                    listeners: {
                        click: function (button) {
                            button.up('form').down('#labWhenComparator').show();
                            button.up('form').down('#labWhenValue').show();
                            button.up('form').down('#hideWhen').show();
                            button.up('form').down('#showWhen').hide();
                        }
                    }
            }, {
                    xtype: 'button',
                    text: 'Hide date range',
                    itemId: 'hideWhen',
                    hidden: true,
                    listeners: {
                        click: function (button) {
                            button.up('form').down('#labWhenComparator').hide();
                            button.up('form').down('#labWhenValue').hide();
                            button.up('form').down('#upperLabWhen').hide();
                            button.up('form').down('#labWhenComparator').setValue('');
                            button.up('form').down('#labWhenValue').setValue('');
                            button.up('form').down('#upperLabWhen').setValue('');
                            button.up('form').down('#hideWhen').hide();
                            button.up('form').down('#showWhen').show();
                        }
                    }
            },{ // When
                xtype: 'combo',
                width: 200,
                itemId: 'labWhenComparator',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select lab date that is',
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
                            combo.up('form').down('#upperLabWhen').show();
                        } else {
                            combo.up('form').down('#upperLabWhen').hide();
                        }
                    }
                }
            }, {
                xtype: 'datefield',
                width: 200,
                itemId: 'labWhenValue',
                fieldLabel: 'value of',
                hidden: true,
                hideTrigger:true
            }, {
                xtype: 'datefield',
                width: 200,
                itemId: 'upperLabWhen',
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
            handler: 'onSubmitLabs'
        }] // end test lab
    }
});