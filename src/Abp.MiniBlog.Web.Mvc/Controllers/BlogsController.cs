﻿using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.MiniBlog.Blog;
using Abp.MiniBlog.Blog.Dtos;
using Abp.MiniBlog.Controllers;
using Abp.MiniBlog.Web.Models.Blogs;
using Microsoft.AspNetCore.Mvc;

namespace Abp.MiniBlog.Web.Controllers
{
    [AbpMvcAuthorize]
    public class BlogsController : MiniBlogControllerBase
    {
        private readonly IBlogAppService _blogAppService;

        public BlogsController(IBlogAppService blogAppService)
        {
            _blogAppService = blogAppService;
        }

        // GET: Blogs
        public ActionResult Index()
        {
            var allBlogs = _blogAppService.GetListAsync(new GetBlogListInput()).Result;
            return View(new BlogsListViewModel
            {
                Blogs = allBlogs
            });
        }

        public async Task<ActionResult> Edit(Guid? blogId = null)
        {
            BlogEditOutput blog = new BlogEditOutput();
            if (blogId != null)
                blog = await _blogAppService.GetEditAsync(blogId.Value);

            return View("Edit", blog);
        }

        public async Task<ActionResult> Update(BlogDetailOutput input)
        {
            if (!string.IsNullOrEmpty(input.Content))
                await _blogAppService.Update(new BlogDto
                {
                    Id = input.Id,
                    Title = input.Title,
                    Excerpt = input.Excerpt,
                    Tags = input.Categories,
                    Content = input.Content
                });
            return Redirect("Index");
        }
    }
}