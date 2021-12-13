---
title: My Ecto.Query Cheatsheet
description: A collection of things I try not to google twice when working on Dispatch
author: jennablumenthal
date: 2021-11-19
tags:
  - posts
layout: layouts/post.njk
---

#### Preamble

This is a collection of the stuff I was looking for when I first began dabbling in Elixir, Phoenix, and particularly Ecto (the <a href="https://hexdocs.pm/ecto/Ecto.html" target="_blank">library</a> used in Phoenix to interact with the data store). It is by no means a comprehensive tutorial, but rather a set of common CRUD-type operations I kept googling over and over until I finally wrote them down somewhere.

If you'd like, you can clone and run the <a href="https://github.com/bikebrigade/dispatch" target="_blank">Dispatch</a> repo to code along with the examples.

##### A note on syntax

Ecto allows you to write queries in two ways: **keyword-based** and **macro-based**. Most examples in the [official docs](https://hexdocs.pm/ecto/Ecto.Query.html) use the keyword-based syntax but I find the less verbose macro-based more straightforward for simple operations, particularly when you are messing around in [IEx](https://hexdocs.pm/iex/1.12/IEx.html), Elixir's interactive shell.

#### Before we get started – reduce the amount of typing with `alias`

Reduce the amount of typing you need to do by [aliasing](https://elixir-lang.org/getting-started/alias-require-and-import.html#alias) commonly used modules.


```elixir
iex> alias BikeBrigade.Repo
BikeBrigade.Repo

# Actually just shorthand for
iex> alias BikeBrigade.Repo, as: Repo
BikeBrigade.Repo

# Allows you to access the module using
iex> Repo
BikeBrigade.Repo
```

#### Queries

```elixir
alias BikeBrigade.Repo
alias BikeBrigade.Accounts.User
import Ecto.Query
```

```elixir
# Find one by ID
User |> Repo.get(1)

# Find one by another attribute
User |> Repo.get_by(name: "Dispatcher McGee")

# Find first (by ID)
User
|> first
|> Repo.one

# List all
User |> Repo.all

# WHERE (by attribute)
User
|> where(name: "Dispatcher McGee")
|> Repo.all

# WHERE (with another operator)
{:ok, today} = DateTime.now("Etc/UTC")
User
|> where([u], u.updated_at < ^today)
|> Repo.all

# WHERE (with a ILIKE operator)
User
|> where([u], ilike(u.name, "%McGee%"))
|> Repo.all

# COUNT
User
|> Repo.aggregate(:count, :id)

# COUNT (by group)
User
|> group_by(:name)
|> select([u], [u.name, count(u.id)])
|> Repo.all

# DISTINCT (get unique values)
User
|> distinct([u], u.name)
|> Repo.all

# LIMIT
limit = 4
User
|> limit(^limit)
|> Repo.all
```

#### Mutations

```elixir
# Create
%User{name: "Stephanie"} |> Repo.insert
```
###
The code above works, but bypasses any validations or constraints we've created. This is where [Ecto.Changeset](https://hexdocs.pm/ecto/Ecto.Changeset.html) comes in.

```elixir
import Ecto.Changeset
```
```elixir
# Create
User.changeset(%User{}, %{name: "Stephanie"})
|> Repo.insert
# => returns errors

# Create (using all required fields)
User.changeset(%User{}, %{name: "Stephanie", email: "stephanie@example.com", phone: "+16475551256"})
|> Repo.insert

# Update
stephanie = User |> Repo.get_by(name: "Stephanie")
User.changeset(stephanie, %{name: "Stephanopolus"})
|> Repo.update

# Delete
stephanie = User |> Repo.get_by(name: "Stephanie")
stephanie |> Repo.delete

# Multiple changes within a transaction
mcgee = User |> Repo.get_by(name: "Dispatcher McGee")
stephanie = User |> Repo.get_by(name: "Stephanie")

Repo.transaction(fn ->
  User.changeset(stephanie, %{email: "bikesrock@example.com"}) |> Repo.update
  User.changeset(mcgee, %{email: "bikesrock@example.com"}) |> Repo.update
end)

# => returns errors because of uniqueness constraint. Neither records are updated.
```

#### Associations

Referencing associations is only allowed when explicitly loaded. For example, the following code will result in an error:
```elixir
iex> alias BikeBrigade.Delivery.Campaign
iex> camapign = Campaign |> Repo.get(1)
iex> campaign.tasks
#Ecto.Association.NotLoaded<association :tasks is not loaded>

# To fix, we explicity query for the tasks along with the campaign
iex> campaign = Campaign |> Repo.get(1) |> Repo.preload(:tasks)
iex> campaign.tasks
[...]
```

##### Persisting associations

Note: Ecto has a couple of ways of handling associations that fall into that sounds-similar-but-slightly different category (`build_assoc`, `put_assoc`, `cast_assoc`, ...). Here I used `put_assoc` to illustrate the scenario where the record we want to associate already exists, any existing associated records should be replaced with the ones provided by the user.

```elixir
iex> alias BikeBrigade.Riders.{Rider, Tag}
iex> rider = Rider |> Ecto.Query.first |> Repo.one |> Repo.preload(:tags)
iex> rider.tags
[]

iex> rapid_response_tag = Repo.insert! %Tag{name: "rapid-responder"}
iex> rider_changeset = Ecto.Changeset.change(rider)
iex> rider_with_tags = Ecto.Changeset.put_assoc(rider_changeset, :tags, [rapid_response_tag])
iex> Repo.update!(rider_with_tags)

iex> rider = Rider |> Ecto.Query.first |> Repo.one |> Repo.preload(:tags)
iex> rider.tags
[
  %BikeBrigade.Riders.Tag{
    ...
    name: "rapid-responder"
  }
]
```

#### More resources
- [https://hexdocs.pm/ecto/Ecto.Query.html](https://hexdocs.pm/ecto/Ecto.Query.html)
- [https://elixirschool.com/en/lessons/ecto/querying_basics#writing-queries-with-ectoquery-3](https://elixirschool.com/en/lessons/ecto/querying_basics#writing-queries-with-ectoquery-3)
- [https://github.com/mauricew/from-activerecord-to-ecto](https://github.com/mauricew/from-activerecord-to-ecto)
- [https://alchemist.camp/episodes/ecto-beginner-build-put-assoc](https://alchemist.camp/episodes/ecto-beginner-build-put-assoc)