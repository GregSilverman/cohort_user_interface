Ext.define('cardioCatalogQT.store.ProceduresPayload', {
    extend: 'Ext.data.Store',
    alias: 'store.ProceduresPayload',

    config:{
        idProperty: 'id',
        fields: [
            {name: 'type', type: 'string'},
            {name: 'key', type: 'string'},
            {name: 'comparator', type: 'string'},
            {name: 'comparatorSymbol', type: 'string'},
            {name: 'value', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'n', type: 'string'},
            {name: 'dateComparator', type: 'string'},
            {name: 'dateComparatorSymbol', type: 'string'},
            {name: 'dateValue', type: 'string'},
            {name: 'atom', type: 'string'},
            {name: 'criteria', type: 'string'} // for display purposes in grid using tooltips

        ],

        storeId: 'Payload',
        autoLoad: true,

        proxy: {
            type: 'sessionstorage',
            id: 'proceduresPayload'
        }
    }
});