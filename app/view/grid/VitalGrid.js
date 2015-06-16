/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.grid.VitalGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.vitalGrid',
    itemId: 'vitalGrid',
    store: 'VitalsPayload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    columns: [
        {text: "Type", width: 120, sortable: true, dataIndex: 'type'},
        {text: "Operator", width: 120, sortable: true, dataIndex: 'comparatorSymbol'},
        {text: "Value", width: 120, sortable: true, dataIndex: 'value'},
        {text: "Combined", flex: 1, sortable: true, dataIndex: 'criteria'},
        {text: "DateOperator", flex: 1, sortable: true, dataIndex: 'dateComparatorSymbol'},
        {text: "When", flex: 1, sortable: true, dataIndex: 'dateValue'},
        {text: "Count", flex: 1, sortable: true, dataIndex: 'n'}
    ],
    columnLines: true,
    selModel: {
        type: 'checkboxmodel',
        listeners: {
            selectionchange: 'onSelectionChange'
        }
    },

    // When true, this view acts as the default listener scope for listeners declared within it.
    // For example the selectionModel's selectionchange listener resolves to this.
    defaultListenerScope: false,

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

        // inline buttons
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            ui: 'footer',
            layout: {
                pack: 'center'
            },
            items: [
                { // Combine checked items with AND
                reference: 'andButton',
                text: 'AND',
                tooltip: 'Add the selected criteria as AND',
                iconCls: 'and',
                handler: 'onCriterionAnd'
            },'-',{ // Combine checked items with OR
                reference: 'orButton',
                text: 'OR',
                tooltip: 'Add the selected criteria as OR',
                iconCls: 'or',
                handler: 'onCriterionOr'
            },'-',{
                reference: 'removeVitalButton',  // The referenceHolder can access this button by this name
                text: 'Remove',
                tooltip: 'Remove the selected item',
                iconCls: 'remove',
                disabled: true,
                handler: 'onCriterionRemove'
            },'-',{ // ClearFilter
                reference: 'ClearFilter',
                text: 'Clear',
                tooltip: 'Clear the current filter',
                iconCls: 'clear',
                handler: 'onFilterClear'
            },{
                minWidth: 80,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onAddSearchGridClick'
            }]
        }, {
            itemId: 'vitals',
            items: [{
                xtype: 'button',
                text: 'Constrain Systolic',
                itemId: 'showSystolic',
                hidden: false,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#systolicComparator').show();
                        button.up('grid').down('#systolicValue').show();
                        button.up('grid').down('#hideSystolic').show();
                        button.up('grid').down('#showSystolic').hide();
                    }
                }
            }, {
                xtype: 'button',
                text: 'Hide systolic',
                itemId: 'hideSystolic',
                hidden: true,
                listeners: {
                    click: function (button) {
                        button.up('grid').down('#systolicComparator').hide();
                        button.up('grid').down('#systolicValue').hide();
                        button.up('grid').down('#upperSystolicValue').hide();
                        button.up('grid').down('#systolicComparator').setValue('');
                        button.up('grid').down('#systolicValue').setValue('');
                        button.up('grid').down('#upperSystolicValue').setValue('');
                        button.up('grid').down('#hideSystolic').hide();
                        button.up('grid').down('#showSystolic').show();
                    }
            }
            },{
                xtype: 'combo',
                itemId: 'systolicComparator',
                queryMode: 'local',
                editable: false,
                value: '',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select systolic bp that is',
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
                            combo.up('grid').down('#upperSystolicValue').show();
                        } else {
                            combo.up('grid').down('#upperSystolicValue').hide();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                itemId: 'systolicValue',
                fieldLabel: 'value of',
                hidden: true,
                value: ''
            }, {
                xtype: 'numberfield',
                itemId: 'upperSystolicValue',
                fieldLabel: 'and',
                hidden: true
            }, {
                    xtype: 'button',
                    text: 'Constrain Diastolic',
                    itemId: 'showDiastolic',
                    hidden: false,
                    listeners: {
                        click: function (button) {
                            button.up('grid').down('#diastolicComparator').show();
                            button.up('grid').down('#diastolicValue').show();
                            button.up('grid').down('#hideDiastolic').show();
                            button.up('grid').down('#showDiastolic').hide();
                        }
                    }
                }, {
                    xtype: 'button',
                    text: 'Hide diastolic',
                    itemId: 'hideDiastolic',
                    hidden: true,
                    listeners: {
                        click: function (button) {
                            button.up('grid').down('#diastolicComparator').hide();
                            button.up('grid').down('#diastolicValue').hide();
                            button.up('grid').down('#upperDiastolicValue').hide();
                            button.up('grid').down('#diastolicComparator').setValue('');
                            button.up('grid').down('#diastolicValue').setValue('');
                            button.up('grid').down('#upperDiastolicValue').setValue('');
                            button.up('grid').down('#hideDiastolic').hide();
                            button.up('grid').down('#showDiastolic').show();
                        }
                    }
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
                            combo.up('grid').down('#upperDiastolicValue').show();
                        } else {
                            combo.up('grid').down('#upperDiastolicValue').hide();
                        }
                    }
                }
            }, {
                xtype: 'numberfield',
                itemId: 'diastolicValue',
                fieldLabel: 'value of',
                hidden: true,
                value: ''
            }, {
                xtype: 'numberfield',
                itemId: 'upperDiastolicValue',
                fieldLabel: 'and',
                hidden: true
            },{
                xtype: 'tbspacer',
                height:25
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
                        button.up('grid').down('#whenComparator').show();
                        button.up('grid').down('#whenValue').show();
                        button.up('grid').down('#hideWhen').show();
                        button.up('grid').down('#showWhen').hide();
                    }
                }
            },{
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
                            combo.up('grid').down('#upperWhenValue').show();
                        } else {
                            combo.up('grid').down('#upperWhenValue').hide();
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


        lbar:[{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Add',
            handler: 'onSubmitVitals'
        }] // end demographics
    }


});