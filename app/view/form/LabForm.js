/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.form.LabForm', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.labGrid',
    itemId: 'labGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

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

        // inline buttons
        dockedItems: [{
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
            },{
                xtype: 'button',
                text: 'Constrain lab value',
                itemId: 'showLab',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#labComparator').show();
                        button.up('grid').down('#labValue').show();
                        button.up('grid').down('#hideLab').show();
                        button.up('grid').down('#showLab').hide();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Hide lab constraint',
                itemId: 'hideLab',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#labComparator').hide();
                        button.up('grid').down('#labValue').hide();
                        button.up('grid').down('#upperLabValue').hide();
                        button.up('grid').down('#labComparator').setValue('');
                        button.up('grid').down('#labValue').setValue('');
                        button.up('grid').down('#upperLabValue').setValue('');
                        button.up('grid').down('#hideLab').hide();
                        button.up('grid').down('#showLab').show();
                    }
                }
            },
            {
                xtype: 'combo',
                flex: 1,
                itemId: 'labComparator',
                queryMode: 'local',
                editable: false,
                value: '',
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
                            combo.up('grid').down('#upperLabValue').show();
                        } else {
                            combo.up('grid').down('#upperLabValue').hide();
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                itemId: 'labValue',
                fieldLabel: 'Min value',
                hidden: true,
                value: ''
            },
            {
                xtype: 'numberfield',
                itemId: 'upperLabValue',
                fieldLabel: 'and',
                hidden: true
            }, {
                xtype: 'tbspacer',
                width: 50
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
                            button.up('grid').down('#whenComparator').show();
                            button.up('grid').down('#whenValue').show();
                            button.up('grid').down('#hideWhen').show();
                            button.up('grid').down('#showWhen').hide();
                        }
                    }
            }, {
                    xtype: 'button',
                    text: 'Hide date range',
                    itemId: 'hideWhen',
                    hidden: true,
                    listeners: {
                        click: function (button) {
                            button.up('grid').down('#whenComparator').hide();
                            button.up('grid').down('#whenValue').hide();
                            button.up('grid').down('#upperWhenValue').hide();
                            button.up('grid').down('#whenComparator').setValue('');
                            button.up('grid').down('#whenValue').setValue('');
                            button.up('grid').down('#upperWhenValue').setValue('');
                            button.up('grid').down('#hideWhen').hide();
                            button.up('grid').down('#showWhen').show();
                        }
                    }
            },{ // When
                xtype: 'combo',
                width: 200,
                itemId: 'whenComparator',
                queryMode: 'local',
                editable: false,
                value: '',
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
                            combo.up('grid').down('#upperWhenValue').show();
                        } else {
                            combo.up('grid').down('#upperWhenValue').hide();
                        }
                    }
                }
            }, {
                xtype: 'datefield',
                width: 200,
                itemId: 'whenValue',
                fieldLabel: 'value of',
                hidden: true,
                hideTrigger:true
            }, {
                xtype: 'datefield',
                width: 200,
                itemId: 'upperWhenValue',
                fieldLabel: 'and',
                hidden: true,
                hideTrigger:true
            },{
                //minWidth: 80,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitLabs'
            }]
        }]
    }

});