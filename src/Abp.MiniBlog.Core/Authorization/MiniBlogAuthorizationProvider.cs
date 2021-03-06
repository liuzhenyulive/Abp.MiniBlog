﻿using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace Abp.MiniBlog.Authorization
{
    public class MiniBlogAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            context.CreatePermission(PermissionNames.Pages_Blogs, L("Blogs"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, MiniBlogConsts.LocalizationSourceName);
        }
    }
}
