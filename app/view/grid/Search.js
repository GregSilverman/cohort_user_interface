Ext.define('cardioCatalogQT.view.grid.Search', {
    extend: 'Ext.grid.Panel',

    xtype: 'framing-buttons',
    store: 'Payload',
    itemId: 'searchGrid',

    requires: [
        'cardioCatalogQT.view.main.MainController'
    ],

    columns: [
        {text: "ID", width: 20, sortable: true, dataIndex: 'id'},
        {text: "Type", width: 120, sortable: true, dataIndex: 'type'},
        {text: "Criteria", flex: 1, sortable: true, dataIndex: 'criteria'},
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
        items: [{
            //reference: 'andButton',
            text: 'AND',
            itemId: 'andButton',
            tooltip: 'Add the selected criteria as AND',
            iconCls: 'and',
            disabled: true,
            handler: 'onCriterionAnd'
        },'-',{
            //reference: 'orButton',
            text: 'OR',
            itemId: 'orButton',
            tooltip: 'Add the selected criteria as OR',
            iconCls: 'or',
            disabled: true,
            handler: 'onCriterionOr'
        },'-',{
            //reference: 'notButton',
            text: 'NOT',
            itemId: 'notButton',
            tooltip: 'Add the selected criteria as NOT',
            iconCls: 'not',
            disabled: true,
            handler: 'onCriterionNot'
        },'-',{
            //reference: 'removeButton',  // The referenceHolder can access this button by this name
            text: 'Remove',
            itemId: 'removeButton',
            tooltip: 'Remove the selected item',
            iconCls: 'remove',
            disabled: true,
            handler: 'onCriterionRemove'
        },'-',{ // ClearFilter
            //reference: 'ClearFilter',
            text: 'Clear',
            itemId: 'clearFilter',
            tooltip: 'Clear the current filter',
            iconCls: 'clear',
            //disabled: true,
            handler: 'onFilterClear'
        },{ // SaveQuery
            //reference: 'SaveQuery',
            text: 'Save',
            itemId: 'saveQuery',
            tooltip: 'save the current filter',
            iconCls: 'save',
            handler: 'onFilterSave'
        },{ // SaveQuery
            //reference: 'RetrieveQuery',
            text: 'Get',
            itemId: 'retrieveQuery',
            tooltip: 'retrieve saved',
            iconCls: 'get',
            handler: 'onFilterRetrieve'
        }]
    }],

    height: 1000,
    frame: true,
    iconCls: 'icon-grid',
    alias: 'widget.searchGrid',
    title: 'Search',

    initComponent: function() {
        this.width = 750;
        this.callParent();
    }
});