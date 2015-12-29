/**
 * This example is an advanced tree example. It illustrates:
 *
 * - Multiple headers
 * - Preloading of nodes with a single AJAX request
 * - Header hiding, showing, reordering and resizing
 * - useArrows configuration
 * - Keyboard Navigation
 * - Discontiguous selection by holding the CTRL key
 * - Using custom iconCls
 * - singleExpand has been set to true
 */
Ext.define('cardioCatalogQT.view.tree.TreeGrid', {
    extend: 'Ext.tree.Panel',

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.ux.CheckColumn',
        'cardioCatalogQT.model.tree.MedsMenu'
    ],
    //xtype: 'tree-grid',
    xtype: 'form',
    alias: 'widget.medTree',
    itemId: 'medTree',

    reserveScrollbar: true,

    title: 'Medications Test',
    height: 370,
    useArrows: true,
    rootVisible: false,
    multiSelect: true,
    singleExpand: true,

    initComponent: function() {
        this.width = 300;

        Ext.apply(this, {
            store: new Ext.data.TreeStore({
                model: cardioCatalogQT.model.tree.MedsMenu,
                proxy: {
                    type: 'ajax',
                    //url: 'resources/data/tree/test.json'
                    url: 'http://127.0.0.1:5000/meds'
                },
                folderSort: true
            }),dockedItems: [{
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
                    text: 'Constrain by date',
                    itemId: 'testButton',
                    tooltip: 'Add the selected criteria as AND',
                    iconCls: 'test',
                    disabled: true,
                    handler: 'onCriterionTest'
                },'-',{
                    //reference: 'orButton',
                    text: 'Add to search',
                    itemId: 'submitButton',
                    tooltip: 'Add the selected criteria as OR',
                    iconCls: 'add',
                    disabled: false,
                    handler: 'onSubmitMedicationsTest'
                },{
                    labelWidth: 130,
                    xtype: 'triggerfield',
                    fieldLabel: 'Filter on drug',
                    triggerCls: 'x-form-clear-trigger',
                    onTriggerClick: function() {
                        // Will trigger the change listener
                        this.reset();
                    },
                    listeners: {
                        change: function() {
                            var tree = this.up('treepanel'),
                                v,
                                matches = 0;

                            try {
                                v = new RegExp(this.getValue(), 'i');
                                Ext.suspendLayouts();
                                tree.store.filter({
                                    filterFn: function(node) {
                                        var children = node.childNodes,
                                            len = children && children.length,

                                        // Visibility of leaf nodes is whether they pass the test.
                                        // Visibility of branch nodes depends on them having visible children.
                                            visible = node.isLeaf() ? v.test(node.get('name')) : false,
                                            i;

                                        // We're visible if one of our child nodes is visible.
                                        // No loop body here. We are looping only while the visible flag remains false.
                                        // Child nodes are filtered before parents, so we can check them here.
                                        // As soon as we find a visible child, this branch node must be visible.
                                        for (i = 0; i < len && !(visible = children[i].get('visible')); i++);

                                        if (visible && node.isLeaf()) {
                                            matches++;
                                        }
                                        return visible;
                                    },
                                    id: 'titleFilter'
                                });
                                tree.down('#matches').setValue(matches);
                                Ext.resumeLayouts(true);
                            } catch (e) {
                                this.markInvalid('Invalid regular expression');
                            }
                        },
                        buffer: 250
                    }
                }, {
                    xtype: 'displayfield',
                    itemId: 'matches',
                    fieldLabel: 'Matches',

                    // Use shrinkwrap width for the label
                    labelWidth: null,
                    listeners: {
                        beforerender: function() {
                            var me = this,
                                tree = me.up('treepanel'),
                                root = tree.getRootNode(),
                                leafCount = 0;

                            tree.store.on('fillcomplete', function(store, node) {
                                if (node === root) {
                                    root.visitPostOrder('', function(node) {
                                        if (node.isLeaf()) {
                                            leafCount++;
                                        }
                                    });
                                    me.setValue(leafCount);
                                }
                            });
                        },
                        single: true
                    }
                }]
            }],
            //selType: 'checkboxmodel',
            selModel: {
                type: 'checkboxmodel',
                listeners: {
                    selectionchange: 'onMedSelectionChange'
                }
            },
            columns: [{
                xtype: 'treecolumn', //this is so we know which column will show the tree
                text: 'Drug Tree',
                flex: 2,
                sortable: true,
                dataIndex: 'name'
            },{
                text: 'Type',
                flex: 1,
                dataIndex: 'type',
                sortable: true
            }, {
                dataIndex: 'drug_code',
                width: 55,
                hidden: false
            }/*,{
                text: 'Add to search',
                width: 55,
                menuDisabled: true,
                xtype: 'actioncolumn',
                tooltip: 'Add',
                align: 'center',
                icon: 'resources/images/edit_task.png',
                handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                    Ext.Msg.alert('Editing' + (record.get('done') ? ' completed task' : '') , record.get('name'));
                },
                // Only leaf level tasks may be edited
                isDisabled: function(view, rowIdx, colIdx, item, record) {
                    return !record.data.leaf;
                }
            }*/]
        });
        this.callParent();
    }
});