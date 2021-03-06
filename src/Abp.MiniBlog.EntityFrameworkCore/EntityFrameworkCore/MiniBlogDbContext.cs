﻿using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Abp.MiniBlog.Authorization.Roles;
using Abp.MiniBlog.Authorization.Users;
using Abp.MiniBlog.Blog;
using Abp.MiniBlog.MultiTenancy;

namespace Abp.MiniBlog.EntityFrameworkCore
{
    public class MiniBlogDbContext : AbpZeroDbContext<Tenant, Role, User, MiniBlogDbContext>
    {
        public virtual DbSet<Blog.Blog> Blogs { get; set; }

        public virtual DbSet<Comment> Comments { get; set; }

        public virtual DbSet<Categories> Categories { get; set; }

        public virtual DbSet<BlogAndCategoriesRelation> BlogAndCategoriesRelations{ get; set; }

        public MiniBlogDbContext(DbContextOptions<MiniBlogDbContext> options)
            : base(options)
        {
        }
    }
}
