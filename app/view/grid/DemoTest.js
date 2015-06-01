/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.main.DemoTest', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.demoForm',
    itemId: 'demoGrid',
    store: 'DemographicsPayload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    columns: [
        {text: "Type", width: 120, sortable: true, dataIndex: 'type'},
        {text: "Operator", width: 120, sortable: true, dataIndex: 'comparatorSymbol'},
        {text: "Value", width: 120, sortable: true, dataIndex: 'value'},
        {text: "Description", flex: 1, sortable: true, dataIndex: 'description'},
        {text: "Combined", flex: 1, sortable: true, dataIndex: 'criteria'},
        {text: "DateOperator", flex: 1, sortable: true, dataIndex: 'dateComparatorSymbol'},
        {text: "When", flex: 1, sortable: true, dataIndex: 'dateValue'},
        {text: "Count", flex: 1, sortable: true, dataIndex: 'n'}
    ],
    columnLines: true,
    selModel: {
        type: 'checkboxmodel',
        listeners: {
            selectionchange: 'onSelectionDemoChange'
        }
    },

    // When true, this view acts as the default listener scope for listeners declared within it.
    // For example the selectionModel's selectionchange listener resolves to this.
    defaultListenerScope: false,

    config: {
        variableHeights: false,
        title: 'DemoTest',
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
                reference: 'removeDemoButton',  // The referenceHolder can access this button by this name
                text: 'Remove',
                tooltip: 'Remove the selected item',
                iconCls: 'remove',
                disabled: true,
                handler: 'onCriterionDemoRemove'
            },{
                minWidth: 80,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'executeTest',
                handler: 'onExecuteTest'
            }]
        }, {
            xtype: 'toolbar',
            height: 200,
            items: [{
                xtype: 'button',
                text: 'Constrain by sex',
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
                        {name: 'male', value: 'm'}
                    ]
                }
            }, {
                xtype: 'button',
                text: 'Constrain Age',
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
                            combo.up('grid').down('#upperAgeValue').show();
                        } else {
                            combo.up('grid').down('#upperAgeValue').hide();
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
            text: 'Add',
            handler: 'onSubmitDemoTest'
        }] // end demographics
    }


});