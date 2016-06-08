// "anyMatch: true," to allow for: no regex start/end line anchors will be added
Ext.define('Ext.overrides.view.MultiSelectorSearch', {
    override: 'Ext.view.MultiSelectorSearch',

    search: function (text) {
        var me = this,
            filter = me.searchFilter,
            filters = me.getSearchStore().getFilters();

        if (text) {
            filters.beginUpdate();

            if (filter) {
                filter.setValue(text);
            } else {
                me.searchFilter = filter = new Ext.util.Filter({
                    id: 'search',
                    property: me.field,
                    value: text,
                    anyMatch: true
                });
            }

            filters.add(filter);

            filters.endUpdate();
        } else if (filter) {
            filters.remove(filter);
        }
    }

});
