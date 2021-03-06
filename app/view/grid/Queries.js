Ext.define('cardioCatalogQT.view.grid.Queries', {
    extend: 'Ext.grid.Panel',

    xtype: 'framing-buttons',
    store: 'Queries',
    itemId: 'queryGrid',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    columns: [
        {text: "Name", width: 120, sortable: true, dataIndex: 'query_name'},
        {text: "Criteria", flex: 1, sortable: true, dataIndex: 'criteria'},
        {text: "User", flex: 1, sortable: true, dataIndex: 'remote_user'}
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
        }
    }, {
        xtype: 'toolbar',
        items: [{ //TODO: disable when none selected
            text: 'Add to search',
            xtype: 'button',
            itemId: 'searchSelected',
            handler: 'onSubmitSaved',
            disabled: true
        },'-',{ //TODO: check a saved query to enable initiate
            text: 'Initiate advanced request',
            xtype: 'button',
            itemId: 'initiateRequest',
            disabled: true,
            handler: 'onSubmitAdvancedRequest'
        }]
    }],
    // TODO: add delete button

    height: 400,
    frame: true,
    iconCls: 'icon-grid',
    alias: 'widget.queryGrid',
    title: 'SavedQueries',

    initComponent: function() {
        this.width = 750;
        this.callParent();
    }
});