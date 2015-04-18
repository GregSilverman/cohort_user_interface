Ext.define('cardioCatalogQT.view.grid.Criteria', {
    extend: 'Ext.grid.Panel',

    xtype: 'framing-buttons',
    store: 'Payload',

    controller: 'main-view',
    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    columns: [
        {text: "Description", flex: 1, sortable: true, dataIndex: 'description'},
        {text: "Type", width: 120, sortable: true, dataIndex: 'type'},
        {text: "Operator", width: 120, sortable: true, dataIndex: 'comparatorSymbol'},
        {text: "Value", width: 120, sortable: true, dataIndex: 'value'}
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

    onSelectionChange: function(sm, selections) {
        this.getReferences().removeButton.setDisabled(selections.length === 0);
    },

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
            text: 'Execute',
            xtype: 'button',
            itemId: 'executeTest',
            handler: 'onExecuteClick'
        }]
        }, {
        xtype: 'toolbar',
        items: [{
            reference: 'removeButton',  // The referenceHolder can access this button by this name
            text: 'Remove Criterion',
            tooltip: 'Remove the selected item',
            iconCls: 'remove',
            disabled: false
        }]
    }],

    height: 300,
    frame: true,
    iconCls: 'icon-grid',
    alias: 'widget.criteriaGrid',
    title: 'Search',

    initComponent: function() {
        this.width = 750;
        this.callParent();
    }
});