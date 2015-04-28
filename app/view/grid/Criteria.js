Ext.define('cardioCatalogQT.view.grid.Criteria', {
    extend: 'Ext.grid.Panel',

    xtype: 'framing-buttons',
    store: 'Payload',
    itemId: 'searchGrid',
    id: 'searchGrid',

    //controller: 'main-view',
    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    columns: [
        {text: "Type", width: 120, sortable: true, dataIndex: 'type'},
        {text: "Operator", width: 120, sortable: true, dataIndex: 'comparatorSymbol'},
        {text: "Value", width: 120, sortable: true, dataIndex: 'value'},
        {text: "Description", flex: 1, sortable: true, dataIndex: 'description'}
    ],
    columnLines: true,
    selModel: {
        type: 'checkboxmodel',
        listeners: {
            selectionchange: 'onSelectionChange'
        }
    },

    // This view acts as the default listener scope for listeners declared within it.
    // For example the selectionModel's selectionchange listener resolves to this.
    defaultListenerScope: false,

    // This view acts as a reference holder for all components below it which have a reference config
    // For example the onSelectionChange listener accesses a button using its reference
    //referenceHolder: true,

    // inline buttons
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        layout: {
            pack: 'center'
        },
        items: [{
            minWidth: 80,
            text: 'Search on criteria',
            xtype: 'button',
            itemId: 'executeTest',
            handler: 'onExecuteClick'
        }]
        }, {
        xtype: 'toolbar',
        items: [{
            reference: 'orButton',
            text: 'OR',
            tooltip: 'Add the selected criteria as OR',
            iconCls: 'or',
            handler: 'onCriterionOr'
        },'-',{
            reference: 'removeButton',  // The referenceHolder can access this button by this name
            text: 'Remove Criterion',
            tooltip: 'Remove the selected item',
            iconCls: 'remove',
            disabled: true,
            handler: 'onCriterionRemove'
        }]
    }],

    height: 300,
    frame: true,
    iconCls: 'icon-grid',
    alias: 'widget.criteriaGrid',
    title: 'SearchCriteria',

    initComponent: function() {
        this.width = 750;
        this.callParent();
    }
});