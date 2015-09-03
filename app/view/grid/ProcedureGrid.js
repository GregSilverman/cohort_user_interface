/**
 * Widget with template to render to Main view
 */

Ext.define('cardioCatalogQT.view.grid.ProcedureGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.procedureGrid',
    itemId: 'procedureGrid',
    store: 'Payload',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    /*columns: [
        {text: "Type", width: 120, sortable: true, dataIndex: 'type'},
        {text: "Operator", width: 120, sortable: true, dataIndex: 'comparatorSymbol'},
        {text: "Value", width: 120, sortable: true, dataIndex: 'value'},
        {text: "Combined", flex: 1, sortable: true, dataIndex: 'criteria'},
        {text: "Description", flex: 1, sortable: true, dataIndex: 'description'},
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
    defaultListenerScope: false,*/

    config: {
        variableHeights: false,
        title: 'Procedures',
        xtype: 'form',
        width: 500,
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 100
        },

        // inline buttons
        dockedItems: [/*{
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
                reference: 'notButton',
                text: 'NOT',
                tooltip: 'Add the selected criteria as NOT',
                iconCls: 'not',
                handler: 'onCriterionNot'
            },'-',{
                reference: 'removeProcedureButton',  // The referenceHolder can access this button by this name
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
                handler: 'onSubmitProcedures'
            }]
        },*/ {
            itemId: 'procedures',
            items: [{
                width: 300,
                anchor: '25%',
                xtype: 'multiselector',
                title: 'Selected Px',
                itemId: 'procedure',
                fieldName: 'description',
                valueField:'code',
                viewConfig: {
                    deferEmptyText: false,
                    emptyText: 'No Px selected'
                },
                // TODO: fix ability to remove selected items when box is unchecked
                search: {
                    field: 'code_description',
                    store: 'Procedures',

                    search: function (text) {
                        cardioCatalogQT.service.UtilityService.multi_select_search(text,this);
                    }
                }
            },{
                xtype: 'tbspacer',
                height:25
            },{ //TODO: Add hide control
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
            },{ // When
                xtype: 'combo',
                width: 200,
                anchor: '20%',
                itemId: 'whenComparator',
                queryMode: 'local',
                editable: false,
                value: 'eq',
                triggerAction: 'all',
                forceSelection: true,
                fieldLabel: 'Select procedure date that is',
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
                width: 200,
                anchor: '20%',
                itemId: 'whenValue',
                fieldLabel: 'value of',
                hidden: true,
                hideTrigger:true
            }, {
                xtype: 'datefield',
                width: 200,
                anchor: '20%',
                itemId: 'upperWhenValue',
                fieldLabel: 'and',
                hidden: true,
                hideTrigger:true
            },{
                //minWidth: 80,
                text: 'Add to search',
                xtype: 'button',
                itemId: 'searchClick',
                handler: 'onSubmitProcedures'
            }]
        },
            {
            //    xtype:'searchGrid'
            }
        ]


        /*lbar:[{
            xtype: 'button',
            itemId: 'button',
            html: 'Toolbar here',
            text: 'Add',
            handler: 'onSubmitProcedures'
        }]*/ // end demographics
    }


});