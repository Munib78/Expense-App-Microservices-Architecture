class DatabaseRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'userManagment':
            return 'default'
        elif model._meta.app_label == 'Expenses':
            return 'postgres'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'userManagment':
            return 'default'
        elif model._meta.app_label == 'Expenses':
            return 'postgres'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._state.db in ['default', 'postgres'] and obj2._state.db in ['default', 'postgres']:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'userManagment':
            return db == 'default'
        elif app_label == 'Expenses':
            return db == 'postgres'
        return None
